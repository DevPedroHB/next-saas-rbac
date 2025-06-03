import { authMiddleware } from "@/http/middlewares/auth-middleware";
import { prisma, zpt } from "@next-saas-rbac/database";
import type { FastifyPluginAsyncZod } from "fastify-type-provider-zod";
import { z } from "zod";
import { ResourceNotFoundError } from "../errors/resource-not-found-error";
import { UnauthorizedError } from "../errors/unauthorized-error";

export const revokeInviteController: FastifyPluginAsyncZod = async (app) => {
	app.register(authMiddleware).patch(
		"/organizations/:slug/invites/:inviteId",
		{
			schema: {
				summary: "Revoke an invite",
				tags: ["Invite"],
				operationId: "revokeInvite",
				security: [{ bearerAuth: [] }],
				params: zpt.OrganizationSchema.pick({ slug: true }).extend({
					inviteId: z.string().uuid(),
				}),
				response: {
					204: z.object({
						message: z.string(),
					}),
				},
			},
		},
		async (request, reply) => {
			const { slug, inviteId } = request.params;

			const { organization, ability } = await request.getUserMembership(slug);

			if (ability.cannot("delete", "Invite")) {
				throw new UnauthorizedError(
					"Você não tem permissão para deletar convites.",
				);
			}

			const invite = await prisma.invite.findUnique({
				where: {
					id: inviteId,
					organizationId: organization.id,
				},
			});

			if (!invite) {
				throw new ResourceNotFoundError();
			}

			await prisma.invite.delete({
				where: {
					id: inviteId,
					organizationId: organization.id,
				},
			});

			return reply.status(204).send({
				message: "Convite revogado com sucesso.",
			});
		},
	);
};
