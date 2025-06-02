import { prisma } from "@next-saas-rbac/database";
import fastifyPlugin from "fastify-plugin";
import { UnauthorizedError } from "../routes/errors/unauthorized-error";

export const authMiddleware = fastifyPlugin(async (app) => {
	app.addHook("preHandler", async (request) => {
		request.getAuthenticatedUser = async () => {
			try {
				const { sub } = await request.jwtVerify<{ sub: string }>();

				const user = await prisma.user.findUnique({
					where: { id: sub },
				});

				if (!user) {
					throw new UnauthorizedError();
				}

				return {
					user,
				};
			} catch {
				throw new UnauthorizedError();
			}
		};

		request.getUserMembership = async (slug: string) => {
			const { user } = await request.getAuthenticatedUser();

			const member = await prisma.member.findFirst({
				where: {
					userId: user.id,
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
				user,
				organization,
				membership,
			};
		};
	});
});
