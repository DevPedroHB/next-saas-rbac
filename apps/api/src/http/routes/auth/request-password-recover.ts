import { prisma } from "@next-saas-rbac/database";
import type { FastifyInstance } from "fastify";
import type { ZodTypeProvider } from "fastify-type-provider-zod";
import { z } from "zod";

export async function requestPasswordRecover(app: FastifyInstance) {
	app.withTypeProvider<ZodTypeProvider>().post(
		"/password/recover",
		{
			schema: {
				summary: "Request password recover",
				tags: ["auth"],
				operationId: "requestPasswordRecover",
				body: z.object({
					email: z.string().email(),
				}),
				response: {
					201: z.object({
						message: z.string(),
					}),
				},
			},
		},
		async (request, reply) => {
			const { email } = request.body;

			const userFromEmail = await prisma.user.findUnique({
				where: { email },
			});

			if (!userFromEmail) {
				// We don't want people to know if user really exists
				return reply.status(201).send({
					message: "Código de recuperação de senha enviado para seu e-mail.",
				});
			}

			const { id: code } = await prisma.token.create({
				data: {
					type: "PASSWORD_RECOVER",
					userId: userFromEmail.id,
				},
			});

			// TODO: Send e-mail with password recover link.
			console.info(`Password recover code: ${code}`);

			return reply.status(201).send({
				message: "Código de recuperação de senha enviado para seu e-mail.",
			});
		},
	);
}
