import { authMiddleware } from "@/http/middlewares/auth-middleware";
import { prisma, zpt } from "@next-saas-rbac/database";
import type { FastifyPluginAsyncZod } from "fastify-type-provider-zod";
import { z } from "zod";
import { ResourceNotFoundError } from "../errors/resource-not-found-error";
import { UnauthorizedError } from "../errors/unauthorized-error";

export const updateMemberController: FastifyPluginAsyncZod = async (app) => {
	app.register(authMiddleware).put(
		"/organizations/:slug/members/:memberId",
		{
			schema: {
				summary: "Update a member",
				tags: ["Member"],
				operationId: "updateMember",
				security: [{ bearerAuth: [] }],
				params: zpt.OrganizationSchema.pick({
					slug: true,
				}).extend({
					memberId: z.string().uuid(),
				}),
				body: zpt.MemberSchema.pick({
					role: true,
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

			if (ability.cannot("update", "User")) {
				throw new UnauthorizedError(
					"Você não tem permissão para atualizar este membro.",
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

			const { role } = request.body;

			await prisma.member.update({
				where: {
					id: memberId,
					organizationId: organization.id,
				},
				data: {
					role,
				},
			});

			return reply.status(204).send({
				message: "Membro atualizado com sucesso.",
			});
		},
	);
};
