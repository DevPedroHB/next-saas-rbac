import { authMiddleware } from "@/http/middlewares/auth-middleware";
import { prisma, zpt } from "@next-saas-rbac/database";
import type { FastifyPluginAsyncZod } from "fastify-type-provider-zod";
import { z } from "zod";
import { InvalidCredentialsError } from "../errors/invalid-credentials-error";
import { UnauthorizedError } from "../errors/unauthorized-error";

export const createInviteController: FastifyPluginAsyncZod = async (app) => {
	app.register(authMiddleware).post(
		"/organizations/:slug/invites",
		{
			schema: {
				summary: "Create a new invite",
				tags: ["Invite"],
				operationId: "createInvite",
				security: [{ bearerAuth: [] }],
				params: zpt.OrganizationSchema.pick({ slug: true }),
				body: zpt.InviteSchema.pick({ email: true, role: true }),
				response: {
					201: z.object({
						inviteId: z.string().uuid(),
					}),
				},
			},
		},
		async (request, reply) => {
			const { slug } = request.params;

			const { user, organization, ability } =
				await request.getUserMembership(slug);

			if (ability.cannot("create", "Invite")) {
				throw new UnauthorizedError(
					"Você não tem permissão para criar convites.",
				);
			}

			const { email, role } = request.body;

			const [, domain] = email.split("@");

			if (
				organization.shouldAttachUsersByDomain &&
				organization.domain === domain
			) {
				throw new InvalidCredentialsError(
					`Users with ${domain} domain will join your organization on login.`,
				);
			}

			const inviteWithSameEmail = await prisma.invite.findUnique({
				where: {
					email_organizationId: {
						email,
						organizationId: organization.id,
					},
				},
			});

			if (inviteWithSameEmail) {
				throw new InvalidCredentialsError(
					"Another invite with same e-mail already exists.",
				);
			}

			const memberWithSameEmail = await prisma.member.findFirst({
				where: {
					organizationId: organization.id,
					user: {
						email,
					},
				},
			});

			if (memberWithSameEmail) {
				throw new InvalidCredentialsError(
					"Another member with same e-mail already exists in your organization.",
				);
			}

			const invite = await prisma.invite.create({
				data: {
					organizationId: organization.id,
					email,
					role,
					authorId: user.id,
				},
			});

			return reply.status(201).send({
				inviteId: invite.id,
			});
		},
	);
};
