import { authMiddleware } from "@/http/middlewares/auth-middleware";
import { prisma, zpt } from "@next-saas-rbac/database";
import type { FastifyPluginAsyncZod } from "fastify-type-provider-zod";
import { z } from "zod";
import { UnauthorizedError } from "../errors/unauthorized-error";

export const getInvitesController: FastifyPluginAsyncZod = async (app) => {
	app.register(authMiddleware).get(
		"/organizations/:slug/invites",
		{
			schema: {
				summary: "Get all organization invites",
				tags: ["Invite"],
				operationId: "getInvites",
				security: [{ bearerAuth: [] }],
				params: zpt.OrganizationSchema.pick({ slug: true }),
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
									})
									.nullable(),
							})
							.array(),
					}),
				},
			},
		},
		async (request, reply) => {
			const { slug } = request.params;

			const { organization, ability } = await request.getUserMembership(slug);

			if (ability.cannot("get", "Invite")) {
				throw new UnauthorizedError(
					"Você não tem permissão para ver os convites.",
				);
			}

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
						},
					},
				},
				where: {
					organizationId: organization.id,
				},
				orderBy: {
					createdAt: "desc",
				},
			});

			return reply.status(201).send({
				invites,
			});
		},
	);
};
