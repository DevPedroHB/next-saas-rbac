import { authMiddleware } from "@/http/middlewares/auth-middleware";
import { prisma, zpt } from "@next-saas-rbac/database";
import type { FastifyPluginAsyncZod } from "fastify-type-provider-zod";
import { z } from "zod";
import { UnauthorizedError } from "../errors/unauthorized-error";

export const getMembersController: FastifyPluginAsyncZod = async (app) => {
	app.register(authMiddleware).get(
		"/organizations/:slug/members",
		{
			schema: {
				summary: "Get all organization members",
				tags: ["Member"],
				operationId: "getMembers",
				security: [{ bearerAuth: [] }],
				params: zpt.OrganizationSchema.pick({
					slug: true,
				}),
				response: {
					200: z.object({
						members: z
							.object({
								userId: z.string(),
								name: z.string().nullable(),
								avatarUrl: z.string().url().nullable(),
								email: z.string().email(),
								id: z.string(),
								role: zpt.RoleSchema,
							})
							.array(),
					}),
				},
			},
		},
		async (request, reply) => {
			const { slug } = request.params;

			const { organization, ability } = await request.getUserMembership(slug);

			if (ability.cannot("get", "User")) {
				throw new UnauthorizedError(
					"Você não tem permissão para ver os membros dessa organização.",
				);
			}

			const members = await prisma.member.findMany({
				select: {
					id: true,
					role: true,
					user: {
						select: {
							id: true,
							name: true,
							email: true,
							avatarUrl: true,
						},
					},
				},
				where: {
					organizationId: organization.id,
				},
				orderBy: {
					role: "asc",
				},
			});

			const membersWithRoles = members.map(
				({ user: { id: userId, ...user }, ...member }) => ({
					userId,
					...user,
					...member,
				}),
			);

			return reply.status(200).send({
				members: membersWithRoles,
			});
		},
	);
};
