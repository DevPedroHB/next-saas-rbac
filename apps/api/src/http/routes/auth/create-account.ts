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

			const passwordHash = await hashSync(password, genSaltSync(10));

			const user = await prisma.user.create({
				data: {
					name,
					email,
					passwordHash,
				},
			});

			return reply.status(201).send({
				user,
			});
		},
	);
}
