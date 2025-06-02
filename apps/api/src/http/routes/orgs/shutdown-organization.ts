import { getUserPermissions } from "@/functions/get-user-permissions";
import { authMiddleware } from "@/http/middlewares/auth-middleware";
import { organizationAuthSchema } from "@next-saas-rbac/auth/src/models/organization-auth";
import { prisma, zpt } from "@next-saas-rbac/database";
import type { FastifyPluginAsyncZod } from "fastify-type-provider-zod";
import { z } from "zod";
import { UnauthorizedError } from "../errors/unauthorized-error";

export const shutdownOrganizationController: FastifyPluginAsyncZod = async (
	app,
) => {
	app.register(authMiddleware).delete(
		"/organizations/:slug",
		{
			schema: {
				summary: "Shutdown organization",
				tags: ["Organization"],
				operationId: "shutdownOrganization",
				security: [{ bearerAuth: [] }],
				params: zpt.OrganizationSchema.pick({
					slug: true,
				}),
				response: {
					204: z.object({
						message: z.string(),
					}),
				},
			},
		},
		async (request, reply) => {
			const { slug } = request.params;

			const { membership, organization } =
				await request.getUserMembership(slug);

			const ability = getUserPermissions(membership.userId, membership.role);
			const organizationAuth = organizationAuthSchema.parse(organization);

			if (ability.cannot("delete", organizationAuth)) {
				throw new UnauthorizedError(
					"Você não tem permissão para deletar esta organização.",
				);
			}

			await prisma.organization.delete({ where: { id: organization.id } });

			return reply.status(204).send({
				message: "Organização deletada com sucesso.",
			});
		},
	);
};
