import { authMiddleware } from "@/http/middlewares/auth-middleware";
import { prisma, zpt } from "@next-saas-rbac/database";
import type { FastifyPluginAsyncZod } from "fastify-type-provider-zod";
import { z } from "zod";
import { UnauthorizedError } from "../errors/unauthorized-error";

export const getOrganizationBillingController: FastifyPluginAsyncZod = async (
	app,
) => {
	app.register(authMiddleware).get(
		"/organizations/:slug/billing",
		{
			schema: {
				summary: "Get billing information from organization",
				tags: ["Billing"],
				operationId: "getOrganizationBilling",
				security: [{ bearerAuth: [] }],
				params: zpt.OrganizationSchema.pick({
					slug: true,
				}),
				response: {
					200: z.object({
						billing: z.object({
							seats: z.object({
								amount: z.number(),
								unit: z.number(),
								price: z.number(),
							}),
							projects: z.object({
								amount: z.number(),
								unit: z.number(),
								price: z.number(),
							}),
							total: z.number(),
						}),
					}),
				},
			},
		},
		async (request, reply) => {
			const { slug } = request.params;
			const { organization, ability } = await request.getUserMembership(slug);

			if (ability.cannot("get", "Billing")) {
				throw new UnauthorizedError(
					"Você não tem permissão para acessar as informação de faturamento desse organização.",
				);
			}

			const [amountOfMembers, amountOfProjects] = await Promise.all([
				prisma.member.count({
					where: {
						organizationId: organization.id,
						role: { not: "ADMIN" },
					},
				}),
				prisma.project.count({
					where: {
						organizationId: organization.id,
					},
				}),
			]);

			return reply.status(200).send({
				billing: {
					seats: {
						amount: amountOfMembers,
						unit: 10,
						price: amountOfMembers * 10,
					},
					projects: {
						amount: amountOfProjects,
						unit: 20,
						price: amountOfProjects * 20,
					},
					total: amountOfMembers * 10 + amountOfProjects * 20,
				},
			});
		},
	);
};
