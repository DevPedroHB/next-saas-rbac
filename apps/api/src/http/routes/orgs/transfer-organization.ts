import { auth } from "@/http/middlewares/auth";
import { prisma } from "@/lib/prisma";
import { getUserPermissions } from "@/utils/get-user-permissions";
import { organization as organizationSchema } from "@next-saas-rbac/auth";
import type { FastifyInstance } from "fastify";
import type { ZodTypeProvider } from "fastify-type-provider-zod";
import z from "zod";
import { BadRequestError } from "../errors/bad-request-error";
import { UnAuthorizedError } from "../errors/unauthorized-error";

export async function transferOrganization(app: FastifyInstance) {
  app
    .withTypeProvider<ZodTypeProvider>()
    .register(auth)
    .patch(
      "/organizations/:slug/owner",
      {
        schema: {
          tags: ["organizations"],
          summary: "Transfer organization ownership.",
          security: [{ bearer: [] }],
          params: z.object({
            slug: z.string(),
          }),
          body: z.object({
            transferToUserId: z.string().uuid(),
          }),
          response: {
            204: z.null(),
          },
        },
      },
      async (request, reply) => {
        const { slug } = request.params;
        const { transferToUserId } = request.body;

        const userId = await request.getCurrentUserId();
        const { membership, organization } =
          await request.getUserMembership(slug);

        const { cannot } = getUserPermissions(userId, membership.role);
        const authOrganization = organizationSchema.parse(organization);

        if (cannot("transfer_ownership", authOrganization)) {
          throw new UnAuthorizedError(
            "You're not allowed to transfer this organization ownership."
          );
        }

        const transferToMembership = await prisma.member.findUnique({
          where: {
            organizationId_userId: {
              organizationId: organization.id,
              userId: transferToUserId,
            },
          },
        });

        if (!transferToMembership) {
          throw new BadRequestError(
            "Target user is not a member of this organization."
          );
        }

        await prisma.$transaction([
          prisma.member.update({
            where: {
              organizationId_userId: {
                organizationId: organization.id,
                userId: transferToUserId,
              },
            },
            data: {
              role: "ADMIN",
            },
          }),
          prisma.organization.update({
            where: {
              id: organization.id,
            },
            data: {
              ownerId: transferToUserId,
            },
          }),
        ]);

        return reply.status(204).send();
      }
    );
}
