import { authMiddleware } from "@/http/middlewares/auth-middleware";
import { projectAuthSchema } from "@next-saas-rbac/auth/src/models/project-auth";
import { prisma, zpt } from "@next-saas-rbac/database";
import type { FastifyPluginAsyncZod } from "fastify-type-provider-zod";
import { z } from "zod";
import { ResourceNotFoundError } from "../errors/resource-not-found-error";
import { UnauthorizedError } from "../errors/unauthorized-error";

export const updateProjectController: FastifyPluginAsyncZod = async (app) => {
	app.register(authMiddleware).put(
		"/organizations/:slug/projects/:id",
		{
			schema: {
				summary: "Update a project",
				tags: ["Project"],
				operationId: "updateProject",
				security: [{ bearerAuth: [] }],
				params: zpt.OrganizationSchema.pick({
					id: true,
					slug: true,
				}),
				body: zpt.ProjectSchema.pick({
					name: true,
					description: true,
				}),
				response: {
					204: z.object({
						message: z.string(),
					}),
				},
			},
		},
		async (request, reply) => {
			const { slug, id } = request.params;

			const { organization, ability } = await request.getUserMembership(slug);

			const project = await prisma.project.findUnique({
				where: {
					id,
					organizationId: organization.id,
				},
			});

			if (!project) {
				throw new ResourceNotFoundError();
			}

			const projectAuth = projectAuthSchema.parse(project);

			if (ability.cannot("update", projectAuth)) {
				throw new UnauthorizedError(
					"Você não tem permissão para atualizar este projeto.",
				);
			}

			const { name, description } = request.body;

			await prisma.project.update({
				where: {
					id: project.id,
					organizationId: organization.id,
				},
				data: {
					name,
					description,
				},
			});

			return reply.status(204).send({
				message: "Projeto atualizado com sucesso.",
			});
		},
	);
};
