import { getUserPermissions } from "@/functions/get-user-permissions";
import { authMiddleware } from "@/http/middlewares/auth-middleware";
import { organizationAuthSchema } from "@next-saas-rbac/auth/src/models/organization-auth";
import { prisma, zpt } from "@next-saas-rbac/database";
import type { FastifyPluginAsyncZod } from "fastify-type-provider-zod";
import { z } from "zod";
import { ResourceNotFoundError } from "../errors/resource-not-found-error";
import { UnauthorizedError } from "../errors/unauthorized-error";

export const transferOrganizationController: FastifyPluginAsyncZod = async (
	app,
) => {
	app.register(authMiddleware).patch(
		"/organizations/:slug/owner",
		{
			schema: {
				summary: "Transfer organization ownership",
				tags: ["Organization"],
				operationId: "transferOrganization",
				security: [{ bearerAuth: [] }],
				params: zpt.OrganizationSchema.pick({
					slug: true,
				}),
				body: zpt.OrganizationSchema.pick({
					ownerId: true,
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

			if (ability.cannot("transfer_ownership", organizationAuth)) {
				throw new UnauthorizedError(
					"Você não tem permissão para transferir esta organização.",
				);
			}

			const { ownerId } = request.body;

			const transferToMembership = await prisma.member.findUnique({
				where: {
					organizationId_userId: {
						organizationId: organization.id,
						userId: ownerId,
					},
				},
			});

			if (!transferToMembership) {
				throw new ResourceNotFoundError(
					"O usuário alvo não é membro desta organização.",
				);
			}

			await prisma.organization.update({
				where: {
					id: organization.id,
				},
				data: {
					ownerId: transferToMembership.userId,
					members: {
						update: {
							where: {
								id: transferToMembership.id,
							},
							data: {
								role: "ADMIN",
							},
						},
					},
				},
			});

			return reply.status(204).send({
				message: "Organização transferida com sucesso.",
			});
		},
	);
};
