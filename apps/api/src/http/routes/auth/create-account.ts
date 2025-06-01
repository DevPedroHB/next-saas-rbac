import { prisma } from "@next-saas-rbac/database";
import { genSaltSync, hashSync } from "bcryptjs";
import type { FastifyInstance } from "fastify";
import type { ZodTypeProvider } from "fastify-type-provider-zod";
import { z } from "zod";

export async function createAccount(app: FastifyInstance) {
	app.withTypeProvider<ZodTypeProvider>().post(
		"/users",
		{
			schema: {
				summary: "Create a new account",
				tags: ["auth"],
				operationId: "createAccount",
				body: z.object({
					name: z.string(),
					email: z.string().email(),
					password: z.string().min(6).max(32),
				}),
			},
		},
		async (request, reply) => {
			const { name, email, password } = request.body;

			const userWithSameEmail = await prisma.user.findUnique({
				where: { email },
			});

			if (userWithSameEmail) {
				return reply.status(400).send({
					message: "User with same email already exists.",
				});
			}

			const [, domain] = email.split("@");

			const autoJoinOrganization = await prisma.organization.findFirst({
				where: {
					domain,
					shouldAttachUsersByDomain: true,
				},
			});

			const passwordHash = await hashSync(password, genSaltSync(10));

			const user = await prisma.user.create({
				data: {
					name,
					email,
					passwordHash,
					member_on: autoJoinOrganization
						? {
								create: {
									organizationId: autoJoinOrganization.id,
								},
							}
						: undefined,
				},
			});

			return reply.status(201).send({
				user,
			});
		},
	);
}
