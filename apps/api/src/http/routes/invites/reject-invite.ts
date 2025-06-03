import { authMiddleware } from "@/http/middlewares/auth-middleware";
import { prisma } from "@next-saas-rbac/database";
import type { FastifyPluginAsyncZod } from "fastify-type-provider-zod";
import { z } from "zod";
import { ResourceNotFoundError } from "../errors/resource-not-found-error";

export const rejectInviteController: FastifyPluginAsyncZod = async (app) => {
	app.register(authMiddleware).patch(
		"/invites/:inviteId/reject",
		{
			schema: {
				summary: "Reject an invite",
				tags: ["Invite"],
				operationId: "rejectInvite",
				security: [{ bearerAuth: [] }],
				params: z.object({
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
			const { user } = await request.getAuthenticatedUser();
			const { inviteId } = request.params;

			const invite = await prisma.invite.findUnique({
				where: {
					id: inviteId,
					email: user.email,
				},
			});

			if (!invite) {
				throw new ResourceNotFoundError();
			}

			await prisma.invite.delete({
				where: {
					id: inviteId,
					email: user.email,
				},
			});

			return reply.status(204).send({
				message: "Convite recusado com sucesso.",
			});
		},
	);
};
