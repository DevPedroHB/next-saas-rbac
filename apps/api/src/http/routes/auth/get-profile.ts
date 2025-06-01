import { prisma } from "@next-saas-rbac/database";
import type { FastifyInstance } from "fastify";
import type { ZodTypeProvider } from "fastify-type-provider-zod";
import { z } from "zod";

export async function getProfile(app: FastifyInstance) {
	app.withTypeProvider<ZodTypeProvider>().get(
		"/profile",
		{
			schema: {
				summary: "Get authenticated user profile",
				tags: ["auth"],
				operationId: "getProfile",
				params: z.object({}),
				response: {
					400: z.object({
						message: z.string(),
					}),
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
			const { sub } = await request.jwtVerify<{ sub: string }>();

			const user = await prisma.user.findUnique({
				select: {
					id: true,
					name: true,
					email: true,
					avatarUrl: true,
				},
				where: { id: sub },
			});

			if (!user) {
				return reply.status(400).send({
					message: "User not found.",
				});
			}

			return reply.status(200).send({
				user,
			});
		},
	);
}
