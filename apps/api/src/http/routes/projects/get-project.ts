import { authMiddleware } from "@/http/middlewares/auth-middleware";
import { prisma } from "@next-saas-rbac/database";
import type { FastifyPluginAsyncZod } from "fastify-type-provider-zod";
import { z } from "zod";
import { ResourceNotFoundError } from "../errors/resource-not-found-error";
import { UnauthorizedError } from "../errors/unauthorized-error";

export const getProjectController: FastifyPluginAsyncZod = async (app) => {
	app.register(authMiddleware).get(
		"/organizations/:orgSlug/projects/:projectSlug",
		{
			schema: {
				summary: "Get a project details",
				tags: ["Project"],
				operationId: "getProject",
				security: [{ bearerAuth: [] }],
				params: z.object({
					orgSlug: z.string(),
					projectSlug: z.string(),
				}),
				response: {
					200: z.object({
						project: z.object({
							id: z.string(),
							name: z.string(),
							description: z.string(),
							slug: z.string(),
							avatarUrl: z.string().nullable(),
							organizationId: z.string(),
							owner: z.object({
								name: z.string().nullable(),
								id: z.string(),
								avatarUrl: z.string().nullable(),
							}),
						}),
					}),
				},
			},
		},
		async (request, reply) => {
			const { orgSlug, projectSlug } = request.params;

			const { organization, ability } =
				await request.getUserMembership(orgSlug);

			if (ability.cannot("get", "Project")) {
				throw new UnauthorizedError(
					"Você não tem permissão para ver este projeto.",
				);
			}

			const project = await prisma.project.findFirst({
				select: {
					id: true,
					name: true,
					description: true,
					slug: true,
					avatarUrl: true,
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
					slug: projectSlug,
					organization: {
						slug: organization.slug,
					},
				},
			});

			if (!project) {
				throw new ResourceNotFoundError();
			}

			return reply.status(200).send({
				project,
			});
		},
	);
};
