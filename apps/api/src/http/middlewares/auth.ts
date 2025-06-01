import { prisma } from "@next-saas-rbac/database";
import type { FastifyInstance } from "fastify";
import fastifyPlugin from "fastify-plugin";
import { UnauthorizedError } from "../routes/errors/unauthorized-error";

export const auth = fastifyPlugin(async (app: FastifyInstance) => {
	app.addHook("preHandler", async (request) => {
		request.getCurrentUserId = async () => {
			try {
				const { sub } = await request.jwtVerify<{ sub: string }>();

				return sub;
			} catch {
				throw new UnauthorizedError();
			}
		};

		request.getUserMembership = async (slug: string) => {
			const userId = await request.getCurrentUserId();

			const member = await prisma.member.findFirst({
				where: {
					userId,
					organization: {
						slug,
					},
				},
				include: {
					organization: true,
				},
			});

			if (!member) {
				throw new UnauthorizedError("Você não é membro desta organização.");
			}

			const { organization, ...membership } = member;

			return {
				organization,
				membership,
			};
		};
	});
});
