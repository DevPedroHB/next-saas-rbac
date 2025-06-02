import { authMiddleware } from "@/http/middlewares/auth-middleware";
import { prisma, zpt } from "@next-saas-rbac/database";
import type { FastifyPluginAsyncZod } from "fastify-type-provider-zod";
import { z } from "zod";

export const getOrganizationsController: FastifyPluginAsyncZod = async (
	app,
) => {
	app.register(authMiddleware).get(
		"/organizations",
		{
			schema: {
				summary: "Get organizations where user is a member",
				tags: ["Organization"],
				operationId: "getOrganizations",
				security: [{ bearerAuth: [] }],
				response: {
					200: z.object({
						organizations: zpt.OrganizationSchema.pick({
							id: true,
							name: true,
							slug: true,
							avatarUrl: true,
						})
							.extend({
								role: zpt.RoleSchema,
							})
							.array(),
					}),
				},
			},
		},
		async (request, reply) => {
			const { user } = await request.getAuthenticatedUser();

			const organizations = await prisma.organization.findMany({
				select: {
					id: true,
					name: true,
					slug: true,
					avatarUrl: true,
					members: {
						select: {
							role: true,
						},
						where: {
							userId: user.id,
						},
					},
				},
				where: {
					members: {
						some: {
							userId: user.id,
						},
					},
				},
			});

			const organizationsWithUserRole = organizations.map(
				({ members, ...organization }) => ({
					...organization,
					role: members[0].role,
				}),
			);

			return reply.status(200).send({
				organizations: organizationsWithUserRole,
			});
		},
	);
};
