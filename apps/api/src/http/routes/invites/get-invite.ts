import { prisma, zpt } from "@next-saas-rbac/database";
import type { FastifyPluginAsyncZod } from "fastify-type-provider-zod";
import { z } from "zod";
import { ResourceNotFoundError } from "../errors/resource-not-found-error";

export const getInviteController: FastifyPluginAsyncZod = async (app) => {
	app.get(
		"/invites/:inviteId",
		{
			schema: {
				summary: "Get invite details",
				tags: ["Invite"],
				operationId: "getInvite",
				params: z.object({
					inviteId: z.string().uuid(),
				}),
				response: {
					200: z.object({
						invite: z.object({
							id: z.string().uuid(),
							email: z.string().email(),
							role: zpt.RoleSchema,
							createdAt: z.date(),
							author: z
								.object({
									id: z.string().uuid(),
									name: z.string().nullable(),
									avatarUrl: z.string().url().nullable(),
								})
								.nullable(),
							organization: z.object({
								name: z.string(),
							}),
						}),
					}),
				},
			},
		},
		async (request, reply) => {
			const { inviteId } = request.params;

			const invite = await prisma.invite.findUnique({
				select: {
					id: true,
					email: true,
					role: true,
					createdAt: true,
					author: {
						select: {
							id: true,
							name: true,
							avatarUrl: true,
						},
					},
					organization: {
						select: {
							name: true,
						},
					},
				},
				where: { id: inviteId },
			});

			if (!invite) {
				throw new ResourceNotFoundError();
			}

			return reply.status(201).send({
				invite,
			});
		},
	);
};
