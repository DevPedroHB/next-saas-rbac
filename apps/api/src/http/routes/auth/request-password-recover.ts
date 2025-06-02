import { prisma, zpt } from "@next-saas-rbac/database";
import type { FastifyPluginAsyncZod } from "fastify-type-provider-zod";
import { z } from "zod";

export const requestPasswordRecoverController: FastifyPluginAsyncZod = async (
	app,
) => {
	app.post(
		"/password/recover",
		{
			schema: {
				summary: "Request password recover",
				tags: ["Authentication"],
				operationId: "requestPasswordRecover",
				body: zpt.UserSchema.pick({
					email: true,
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

			const user = await prisma.user.findUnique({
				where: { email },
			});

			if (!user) {
				return reply.status(201).send({
					message: "Código de recuperação de senha enviado para seu e-mail.",
				});
			}

			const { id: code } = await prisma.token.create({
				data: {
					type: "PASSWORD_RECOVER",
					userId: user.id,
				},
			});

			// TODO: Send e-mail with password recover link.
			console.info("Password recover token:", code);

			return reply.status(201).send({
				message: "Código de recuperação de senha enviado para seu e-mail.",
			});
		},
	);
};
