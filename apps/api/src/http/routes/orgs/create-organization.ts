import { slugify } from "@/functions/slugify";
import { authMiddleware } from "@/http/middlewares/auth-middleware";
import { prisma, zpt } from "@next-saas-rbac/database";
import type { FastifyPluginAsyncZod } from "fastify-type-provider-zod";
import { z } from "zod";
import { AlreadyExistsError } from "../errors/already-exists-error";

export const createOrganizationController: FastifyPluginAsyncZod = async (
	app,
) => {
	app.register(authMiddleware).post(
		"/organizations",
		{
			schema: {
				summary: "Create a new organization",
				tags: ["Organization"],
				operationId: "createOrganization",
				security: [{ bearerAuth: [] }],
				body: zpt.OrganizationSchema.pick({
					name: true,
					domain: true,
					shouldAttachUsersByDomain: true,
				}),
				response: {
					201: z.object({
						message: z.string(),
					}),
				},
			},
		},
		async (request, reply) => {
			const { user } = await request.getAuthenticatedUser();
			const { name, domain, shouldAttachUsersByDomain } = request.body;

			if (domain) {
				const organizationWithSameDomain = await prisma.organization.findUnique(
					{
						where: { domain },
					},
				);

				if (organizationWithSameDomain) {
					throw new AlreadyExistsError(
						"Já existe outra organização com o mesmo domínio.",
					);
				}
			}

			await prisma.organization.create({
				data: {
					name,
					slug: slugify(name),
					domain,
					shouldAttachUsersByDomain,
					ownerId: user.id,
					members: {
						create: {
							userId: user.id,
							role: "ADMIN",
						},
					},
				},
			});

			return reply.status(201).send({
				message: "Organização criada com sucesso.",
			});
		},
	);
};
