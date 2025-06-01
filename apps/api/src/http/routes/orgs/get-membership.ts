import { auth } from "@/http/middlewares/auth";
import { Role } from "@next-saas-rbac/database";
import type { FastifyInstance } from "fastify";
import type { ZodTypeProvider } from "fastify-type-provider-zod";
import { z } from "zod";

export async function getMembership(app: FastifyInstance) {
	app
		.withTypeProvider<ZodTypeProvider>()
		.register(auth)
		.get(
			"/organizations/:slug/membership",
			{
				schema: {
					summary: "Get user membership on organization",
					tags: ["Organization"],
					operationId: "getMembership",
					security: [{ bearerAuth: [] }],
					params: z.object({
						slug: z.string(),
					}),
					response: {
						200: z.object({
							membership: z.object({
								id: z.string(),
								role: z.nativeEnum(Role),
								organizationId: z.string(),
							}),
						}),
					},
				},
			},
			async (request, reply) => {
				const { slug } = request.params;
				const { membership } = await request.getUserMembership(slug);

				reply.status(200).send({
					membership: {
						id: membership.id,
						role: membership.role,
						organizationId: membership.organizationId,
					},
				});
			},
		);
}
