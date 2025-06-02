import { authMiddleware } from "@/http/middlewares/auth-middleware";
import { prisma, zpt } from "@next-saas-rbac/database";
import type { FastifyPluginAsyncZod } from "fastify-type-provider-zod";
import { z } from "zod";
import { UnauthorizedError } from "../errors/unauthorized-error";

export const getProjectsController: FastifyPluginAsyncZod = async (app) => {
	app.register(authMiddleware).get(
		"/organizations/:slug/projects",
		{
			schema: {
				summary: "Get all organization projects",
				tags: ["Project"],
				operationId: "getProjects",
				security: [{ bearerAuth: [] }],
				params: zpt.OrganizationSchema.pick({
					slug: true,
				}),
				response: {
					200: z.object({
						projects: z
							.object({
								id: z.string(),
								name: z.string(),
								description: z.string(),
								slug: z.string(),
								avatarUrl: z.string().nullable(),
								createdAt: z.date(),
								organizationId: z.string(),
								owner: z.object({
									name: z.string().nullable(),
									id: z.string(),
									avatarUrl: z.string().nullable(),
								}),
							})
							.array(),
					}),
				},
			},
		},
		async (request, reply) => {
			const { slug } = request.params;

			const { organization, ability } = await request.getUserMembership(slug);

			if (ability.cannot("get", "Project")) {
				throw new UnauthorizedError(
					"Você não tem permissão para ver os projetos dessa organização.",
				);
			}

			const projects = await prisma.project.findMany({
				select: {
					id: true,
					name: true,
					description: true,
					slug: true,
					avatarUrl: true,
					createdAt: true,
					organizationId: true,
					owner: {
						select: {
							id: true,
							name: true,
							avatarUrl: true,
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

			return reply.status(200).send({
				projects,
			});
		},
	);
};
