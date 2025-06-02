import { slugify } from "@/functions/slugify";
import { authMiddleware } from "@/http/middlewares/auth-middleware";
import { prisma, zpt } from "@next-saas-rbac/database";
import type { FastifyPluginAsyncZod } from "fastify-type-provider-zod";
import { z } from "zod";
import { UnauthorizedError } from "../errors/unauthorized-error";

export const createProjectController: FastifyPluginAsyncZod = async (app) => {
	app.register(authMiddleware).post(
		"/organizations/:slug/projects",
		{
			schema: {
				summary: "Create a new project",
				tags: ["Project"],
				operationId: "createProject",
				security: [{ bearerAuth: [] }],
				params: zpt.OrganizationSchema.pick({
					slug: true,
				}),
				body: zpt.ProjectSchema.pick({
					name: true,
					description: true,
				}),
				response: {
					201: z.object({
						message: z.string(),
					}),
				},
			},
		},
		async (request, reply) => {
			const { slug } = request.params;

			const { membership, organization, ability } =
				await request.getUserMembership(slug);

			if (ability.cannot("create", "Project")) {
				throw new UnauthorizedError(
					"Você não tem permissão para criar novos projetos.",
				);
			}

			const { name, description } = request.body;

			await prisma.project.create({
				data: {
					name,
					description,
					slug: slugify(name),
					organizationId: organization.id,
					ownerId: membership.userId,
				},
			});

			return reply.status(201).send({
				message: "Projeto criado com sucesso.",
			});
		},
	);
};
