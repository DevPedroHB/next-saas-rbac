import { prisma, zpt } from "@next-saas-rbac/database";
import { compare } from "bcryptjs";
import type { FastifyPluginAsyncZod } from "fastify-type-provider-zod";
import { z } from "zod";
import { InvalidCredentialsError } from "../errors/invalid-credentials-error";
import { ResourceNotFoundError } from "../errors/resource-not-found-error";

export const authenticateWithPasswordController: FastifyPluginAsyncZod = async (
	app,
) => {
	app.post(
		"/sessions/password",
		{
			schema: {
				summary: "Authenticate with e-mail & password",
				tags: ["Authentication"],
				operationId: "authenticateWithPassword",
				body: zpt.UserSchema.pick({
					email: true,
				}).extend({
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

			const user = await prisma.user.findUnique({
				where: { email },
			});

			if (!user) {
				throw new InvalidCredentialsError();
			}

			if (user.passwordHash === null) {
				throw new ResourceNotFoundError(
					"User does not have a password, use, social login.",
				);
			}

			const isPasswordValid = await compare(password, user.passwordHash);

			if (!isPasswordValid) {
				throw new InvalidCredentialsError();
			}

			const token = await reply.jwtSign(
				{
					sub: user.id,
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
};
