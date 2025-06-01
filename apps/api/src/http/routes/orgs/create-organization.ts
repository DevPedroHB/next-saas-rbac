import { slugify } from "@/functions/slugify";
import { auth } from "@/http/middlewares/auth";
import { prisma } from "@next-saas-rbac/database";
import type { FastifyInstance } from "fastify";
import type { ZodTypeProvider } from "fastify-type-provider-zod";
import { z } from "zod";
import { InvalidCredentialsError } from "../errors/invalid-credentials-error";

export async function createOrganization(app: FastifyInstance) {
	app
		.withTypeProvider<ZodTypeProvider>()
		.register(auth)
		.post(
			"/organization",
			{
				schema: {
					summary: "Create a new organization",
					tags: ["Organization"],
					operationId: "createOrganization",
					security: [{ bearerAuth: [] }],
					body: z.object({
						name: z.string(),
						domain: z.string().nullish(),
						shouldAttachUsersByDomain: z.boolean().optional(),
					}),
					response: {
						201: z.object({
							organizationId: z.string(),
						}),
					},
				},
			},
			async (request, reply) => {
				const userId = await request.getCurrentUserId();

				const { name, domain, shouldAttachUsersByDomain } = request.body;

				if (domain) {
					const organizationByDomain = await prisma.organization.findUnique({
						where: { domain },
					});

					if (organizationByDomain) {
						throw new InvalidCredentialsError(
							"Já existe outra organização com o mesmo domínio.",
						);
					}
				}

				const organization = await prisma.organization.create({
					data: {
						name,
						slug: slugify(name),
						domain,
						shouldAttachUsersByDomain,
						ownerId: userId,
						members: {
							create: {
								userId,
								role: "ADMIN",
							},
						},
					},
				});

				reply.status(201).send({
					organizationId: organization.id,
				});
			},
		);
}
