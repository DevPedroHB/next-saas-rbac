import { prisma } from "@next-saas-rbac/database";
import { compareSync } from "bcryptjs";
import type { FastifyInstance } from "fastify";
import type { ZodTypeProvider } from "fastify-type-provider-zod";
import { z } from "zod";
import { InvalidCredentialsError } from "../errors/invalid-credentials-error";

export async function authenticateWithPassword(app: FastifyInstance) {
	app.withTypeProvider<ZodTypeProvider>().post(
		"/sessions/password",
		{
			schema: {
				summary: "Authenticate with password",
				tags: ["auth"],
				operationId: "authenticateWithPassword",
				body: z.object({
					email: z.string().email(),
					password: z.string().min(6).max(32),
				}),
				response: {
					201: z.object({
						token: z.string(),
					}),
				},
			},
		},
		async (request, reply) => {
			const { email, password } = request.body;

			const userFromEmail = await prisma.user.findUnique({
				where: { email },
			});

			if (!userFromEmail) {
				throw new InvalidCredentialsError();
			}

			if (userFromEmail.passwordHash === null) {
				throw new InvalidCredentialsError(
					"O usuário não possui uma senha, utilize o login social.",
				);
			}

			const isPasswordValid = await compareSync(
				password,
				userFromEmail.passwordHash,
			);

			if (!isPasswordValid) {
				throw new InvalidCredentialsError();
			}

			const token = await reply.jwtSign(
				{
					sub: userFromEmail.id,
				},
				{
					sign: {
						expiresIn: "7d", // 7 days
					},
				},
			);

			return reply.status(201).send({
				token,
			});
		},
	);
}
