import { auth } from "@/http/middlewares/auth";
import { prisma } from "@next-saas-rbac/database";
import type { FastifyInstance } from "fastify";
import type { ZodTypeProvider } from "fastify-type-provider-zod";
import { z } from "zod";
import { UnauthorizedError } from "../errors/unauthorized-error";

export async function getProfile(app: FastifyInstance) {
	app
		.withTypeProvider<ZodTypeProvider>()
		.register(auth)
		.get(
			"/profile",
			{
				schema: {
					summary: "Get authenticated user profile",
					tags: ["Auth"],
					operationId: "getProfile",
					security: [{ bearerAuth: [] }],
					params: z.object({}),
					response: {
						200: z.object({
							user: z.object({
								id: z.string(),
								name: z.string().nullable(),
								email: z.string(),
								avatarUrl: z.string().nullable(),
							}),
						}),
					},
				},
			},
			async (request, reply) => {
				const userId = await request.getCurrentUserId();

				const user = await prisma.user.findUnique({
					select: {
						id: true,
						name: true,
						email: true,
						avatarUrl: true,
					},
					where: { id: userId },
				});

				if (!user) {
					throw new UnauthorizedError();
				}

				return reply.status(200).send({
					user,
				});
			},
		);
}
