import { auth } from "@/http/middlewares/auth";
import { prisma } from "@/lib/prisma";
import { getUserPermissions } from "@/utils/get-user-permissions";
import { project as projectSchema } from "@next-saas-rbac/auth";
import type { FastifyInstance } from "fastify";
import type { ZodTypeProvider } from "fastify-type-provider-zod";
import z from "zod";
import { BadRequestError } from "../errors/bad-request-error";
import { UnAuthorizedError } from "../errors/unauthorized-error";

export async function updateProject(app: FastifyInstance) {
  app
    .withTypeProvider<ZodTypeProvider>()
    .register(auth)
    .put(
      "/organizations/:slug/project/:projectId",
      {
        schema: {
          tags: ["projects"],
          summary: "Update a project.",
          security: [{ bearer: [] }],
          params: z.object({
            slug: z.string(),
            projectId: z.string().uuid(),
          }),
          body: z.object({
            name: z.string(),
            description: z.string(),
          }),
          response: {
            204: z.null(),
          },
        },
      },
      async (request, reply) => {
        const { slug, projectId } = request.params;
        const { name, description } = request.body;

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

        if (cannot("update", authProject)) {
          throw new UnAuthorizedError(
            "You're not allowed to update this project."
          );
        }

        await prisma.project.update({
          where: {
            id: projectId,
            organizationId: organization.id,
          },
          data: {
            name,
            description,
          },
        });

        reply.status(204).send();
      }
    );
}
