import { authMiddleware } from "@/http/middlewares/auth-middleware";
import { organizationAuthSchema } from "@next-saas-rbac/auth/src/models/organization-auth";
import { prisma, zpt } from "@next-saas-rbac/database";
import type { FastifyPluginAsyncZod } from "fastify-type-provider-zod";
import { z } from "zod";
import { AlreadyExistsError } from "../errors/already-exists-error";
import { UnauthorizedError } from "../errors/unauthorized-error";

export const updateOrganizationController: FastifyPluginAsyncZod = async (
	app,
) => {
	app.register(authMiddleware).put(
		"/organizations/:slug",
		{
			schema: {
				summary: "Update organization details",
				tags: ["Organization"],
				operationId: "updateOrganization",
				security: [{ bearerAuth: [] }],
				params: zpt.OrganizationSchema.pick({
					slug: true,
				}),
				body: zpt.OrganizationSchema.pick({
					name: true,
					domain: true,
					shouldAttachUsersByDomain: true,
				}),
				response: {
					204: z.object({
						message: z.string(),
					}),
				},
			},
		},
		async (request, reply) => {
			const { slug } = request.params;

			const { organization, ability } = await request.getUserMembership(slug);

			const organizationAuth = organizationAuthSchema.parse(organization);

			if (ability.cannot("update", organizationAuth)) {
				throw new UnauthorizedError(
					"Você não tem permissão para atualizar esta organização.",
				);
			}

			const { name, domain, shouldAttachUsersByDomain } = request.body;

			if (domain) {
				const organizationWithSameDomain = await prisma.organization.findFirst({
					where: {
						domain,
						slug: {
							not: slug,
						},
					},
				});

				if (organizationWithSameDomain) {
					throw new AlreadyExistsError(
						"Já existe outra organização com o mesmo domínio.",
					);
				}
			}

			await prisma.organization.update({
				where: {
					id: organization.id,
				},
				data: {
					name,
					domain,
					shouldAttachUsersByDomain,
				},
			});

			return reply.status(204).send({
				message: "Organização atualizada com sucesso.",
			});
		},
	);
};
