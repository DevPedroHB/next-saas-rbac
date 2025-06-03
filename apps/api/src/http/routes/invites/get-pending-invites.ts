import { authMiddleware } from "@/http/middlewares/auth-middleware";
import { prisma, zpt } from "@next-saas-rbac/database";
import type { FastifyPluginAsyncZod } from "fastify-type-provider-zod";
import { z } from "zod";

export const getPendingInvitesController: FastifyPluginAsyncZod = async (
	app,
) => {
	app.register(authMiddleware).get(
		"/pending-invites",
		{
			schema: {
				summary: "Get all user pending invites",
				tags: ["Invite"],
				operationId: "getPendingInvites",
				security: [{ bearerAuth: [] }],
				response: {
					200: z.object({
						invites: z
							.object({
								id: z.string().uuid(),
								email: z.string().email(),
								role: zpt.RoleSchema,
								createdAt: z.date(),
								author: z
									.object({
										id: z.string().uuid(),
										name: z.string().nullable(),
										avatarUrl: z.string().url().nullable(),
									})
									.nullable(),
								organization: z.object({
									name: z.string(),
								}),
							})
							.array(),
					}),
				},
			},
		},
		async (request, reply) => {
			const { user } = await request.getAuthenticatedUser();

			const invites = await prisma.invite.findMany({
				select: {
					id: true,
					email: true,
					role: true,
					createdAt: true,
					author: {
						select: {
							id: true,
							name: true,
							avatarUrl: true,
						},
					},
					organization: {
						select: {
							name: true,
						},
					},
				},
				where: {
					email: user.email,
				},
			});

			return reply.status(200).send({
				invites,
			});
		},
	);
};
