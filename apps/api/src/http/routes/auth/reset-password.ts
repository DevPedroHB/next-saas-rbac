import { prisma } from "@next-saas-rbac/database";
import { genSaltSync, hashSync } from "bcryptjs";
import type { FastifyInstance } from "fastify";
import type { ZodTypeProvider } from "fastify-type-provider-zod";
import { z } from "zod";
import { UnauthorizedError } from "../errors/unauthorized-error";

export async function resetPassword(app: FastifyInstance) {
	app.withTypeProvider<ZodTypeProvider>().put(
		"/password/reset",
		{
			schema: {
				summary: "Reset password",
				tags: ["Auth"],
				operationId: "resetPassword",
				body: z.object({
					code: z.string(),
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

			const tokenFromCode = await prisma.token.findUnique({
				where: { id: code },
			});

			if (!tokenFromCode) {
				throw new UnauthorizedError();
			}

			const passwordHash = await hashSync(password, genSaltSync(10));

			await prisma.user.update({
				where: { id: tokenFromCode.userId },
				data: { passwordHash },
			});

			await prisma.token.delete({
				where: { id: tokenFromCode.id },
			});

			return reply.status(204).send({
				message: "Senha alterada com sucesso.",
			});
		},
	);
}
