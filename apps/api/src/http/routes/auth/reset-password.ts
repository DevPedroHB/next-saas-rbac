import { prisma } from "@next-saas-rbac/database";
import { genSalt, hash } from "bcryptjs";
import type { FastifyPluginAsyncZod } from "fastify-type-provider-zod";
import { z } from "zod";
import { NotAllowedError } from "../errors/not-allowed-error";

export const resetPasswordController: FastifyPluginAsyncZod = async (app) => {
	app.put(
		"/password/reset",
		{
			schema: {
				summary: "Reset password",
				tags: ["Authentication"],
				operationId: "resetPassword",
				body: z.object({
					code: z.string().uuid(),
					password: z.string().min(6).max(32),
				}),
				response: {
					204: z.object({
						message: z.string(),
					}),
				},
			},
		},
		async (request, reply) => {
			const { code, password } = request.body;

			const token = await prisma.token.findUnique({
				where: { id: code },
			});

			if (!token) {
				throw new NotAllowedError();
			}

			const saltRounds = await genSalt(10);
			const passwordHash = await hash(password, saltRounds);

			await prisma.$transaction([
				prisma.user.update({
					where: {
						id: token.userId,
					},
					data: {
						passwordHash,
					},
				}),
				prisma.token.delete({
					where: {
						id: code,
					},
				}),
			]);

			return reply.status(204).send({
				message: "Senha alterada com sucesso.",
			});
		},
	);
};
