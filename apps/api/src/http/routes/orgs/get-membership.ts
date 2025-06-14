import { authMiddleware } from "@/http/middlewares/auth-middleware";
import { zpt } from "@next-saas-rbac/database";
import type { FastifyPluginAsyncZod } from "fastify-type-provider-zod";
import { z } from "zod";

export const getMembershipController: FastifyPluginAsyncZod = async (app) => {
	app.register(authMiddleware).get(
		"/organizations/:slug/membership",
		{
			schema: {
				summary: "Get membership",
				tags: ["Organization"],
				operationId: "getMembership",
				security: [{ bearerAuth: [] }],
				params: zpt.OrganizationSchema.pick({
					slug: true,
				}),
				response: {
					200: z.object({
						membership: zpt.MemberSchema,
					}),
				},
			},
		},
		async (request, reply) => {
			const { slug } = request.params;

			const { membership } = await request.getUserMembership(slug);

			return reply.status(200).send({
				membership,
			});
		},
	);
};
