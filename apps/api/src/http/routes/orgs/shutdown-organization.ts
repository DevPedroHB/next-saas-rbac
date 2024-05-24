import { auth } from "@/http/middlewares/auth";
import { prisma } from "@/lib/prisma";
import { getUserPermissions } from "@/utils/get-user-permissions";
import { organization as organizationSchema } from "@next-saas-rbac/auth";
import type { FastifyInstance } from "fastify";
import type { ZodTypeProvider } from "fastify-type-provider-zod";
import z from "zod";
import { UnAuthorizedError } from "../errors/unauthorized-error";

export async function shutdownOrganization(app: FastifyInstance) {
  app
    .withTypeProvider<ZodTypeProvider>()
    .register(auth)
    .delete(
      "/organizations/:slug",
      {
        schema: {
          tags: ["organizations"],
          summary: "Shutdown organization.",
          security: [{ bearer: [] }],
          params: z.object({
            slug: z.string(),
          }),
          response: {
            204: z.null(),
          },
        },
      },
      async (request, reply) => {
        const { slug } = request.params;

        const userId = await request.getCurrentUserId();
        const { membership, organization } =
          await request.getUserMembership(slug);

        const { cannot } = getUserPermissions(userId, membership.role);
        const authOrganization = organizationSchema.parse(organization);

        if (cannot("create", authOrganization)) {
          throw new UnAuthorizedError(
            "You're not allowed to shutdown this organization."
          );
        }

        await prisma.organization.delete({
          where: {
            id: organization.id,
          },
        });

        return reply.status(204).send();
      }
    );
}
