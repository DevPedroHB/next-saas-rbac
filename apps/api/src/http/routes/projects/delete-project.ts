import { auth } from "@/http/middlewares/auth";
import { prisma } from "@/lib/prisma";
import { getUserPermissions } from "@/utils/get-user-permissions";
import { project as projectSchema } from "@next-saas-rbac/auth";
import type { FastifyInstance } from "fastify";
import type { ZodTypeProvider } from "fastify-type-provider-zod";
import z from "zod";
import { BadRequestError } from "../errors/bad-request-error";
import { UnAuthorizedError } from "../errors/unauthorized-error";

export async function deleteProject(app: FastifyInstance) {
  app
    .withTypeProvider<ZodTypeProvider>()
    .register(auth)
    .delete(
      "/organizations/:slug/project/:projectId",
      {
        schema: {
          tags: ["projects"],
          summary: "Delete a project.",
          security: [{ bearer: [] }],
          params: z.object({
            slug: z.string(),
            projectId: z.string().uuid(),
          }),
          response: {
            204: z.null(),
          },
        },
      },
      async (request, reply) => {
        const { slug, projectId } = request.params;

        const userId = await request.getCurrentUserId();
        const { organization, membership } =
          await request.getUserMembership(slug);

        const project = await prisma.project.findUnique({
          where: {
            id: projectId,
            organizationId: organization.id,
          },
        });

        if (!project) {
          throw new BadRequestError("Project not found.");
        }

        const { cannot } = getUserPermissions(userId, membership.role);
        const authProject = projectSchema.parse(project);

        if (cannot("delete", authProject)) {
          throw new UnAuthorizedError(
            "You're not allowed to delete this project."
          );
        }

        await prisma.project.delete({
          where: {
            id: projectId,
            organizationId: organization.id,
          },
        });

        reply.status(204).send();
      }
    );
}
