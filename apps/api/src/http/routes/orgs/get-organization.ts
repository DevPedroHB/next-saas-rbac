import { authMiddleware } from "@/http/middlewares/auth-middleware";
import { zpt } from "@next-saas-rbac/database";
import type { FastifyPluginAsyncZod } from "fastify-type-provider-zod";
import { z } from "zod";

export const getOrganizationController: FastifyPluginAsyncZod = async (app) => {
	app.register(authMiddleware).get(
		"/organizations/:slug",
		{
			schema: {
				summary: "Get details from organization",
				tags: ["Organization"],
				operationId: "getOrganization",
				security: [{ bearerAuth: [] }],
				params: zpt.OrganizationSchema.pick({
					slug: true,
				}),
				response: {
					200: z.object({
						organization: zpt.OrganizationSchema,
					}),
				},
			},
		},
		async (request, reply) => {
			const { slug } = request.params;
			const { organization } = await request.getUserMembership(slug);

			return reply.status(200).send({
				organization,
			});
		},
	);
};
