import { authMiddleware } from "@/http/middlewares/auth-middleware";
import { prisma, zpt } from "@next-saas-rbac/database";
import type { FastifyPluginAsyncZod } from "fastify-type-provider-zod";
import { z } from "zod";
import { ResourceNotFoundError } from "../errors/resource-not-found-error";
import { UnauthorizedError } from "../errors/unauthorized-error";

export const removeMemberController: FastifyPluginAsyncZod = async (app) => {
	app.register(authMiddleware).delete(
		"/organizations/:slug/members/:memberId",
		{
			schema: {
				summary: "Remove a member from the organization",
				tags: ["Member"],
				operationId: "removeMember",
				security: [{ bearerAuth: [] }],
				params: zpt.OrganizationSchema.pick({
					slug: true,
				}).extend({
					memberId: z.string().uuid(),
				}),
				response: {
					204: z.object({
						message: z.string(),
					}),
				},
			},
		},
		async (request, reply) => {
			const { slug, memberId } = request.params;

			const { organization, ability } = await request.getUserMembership(slug);

			if (ability.cannot("delete", "User")) {
				throw new UnauthorizedError(
					"Você não tem permissão para remover este membro.",
				);
			}

			const member = await prisma.member.findFirst({
				where: {
					id: memberId,
					organizationId: organization.id,
				},
			});

			if (!member) {
				throw new ResourceNotFoundError();
			}

			await prisma.member.delete({
				where: {
					id: memberId,
					organizationId: organization.id,
				},
			});

			return reply.status(204).send({
				message: "Membro removido com sucesso.",
			});
		},
	);
};
