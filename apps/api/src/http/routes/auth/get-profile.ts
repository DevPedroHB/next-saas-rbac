import { authMiddleware } from "@/http/middlewares/auth-middleware";
import { zpt } from "@next-saas-rbac/database";
import type { FastifyPluginAsyncZod } from "fastify-type-provider-zod";
import { z } from "zod";

export const getProfileController: FastifyPluginAsyncZod = async (app) => {
	app.register(authMiddleware).get(
		"/profile",
		{
			schema: {
				summary: "Get authenticated user profile",
				tags: ["Authentication"],
				operationId: "getProfile",
				security: [{ bearerAuth: [] }],
				response: {
					200: z.object({
						user: zpt.UserSchema.omit({
							passwordHash: true,
						}),
					}),
				},
			},
		},
		async (request, reply) => {
			const { user } = await request.getAuthenticatedUser();

			const { passwordHash: _, ...userWithoutPassword } = user;

			return reply.status(200).send({
				user: userWithoutPassword,
			});
		},
	);
};
