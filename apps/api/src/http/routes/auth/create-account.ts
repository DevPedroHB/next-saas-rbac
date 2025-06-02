import { prisma, zpt } from "@next-saas-rbac/database";
import { genSalt, hash } from "bcryptjs";
import type { FastifyPluginAsyncZod } from "fastify-type-provider-zod";
import { z } from "zod";
import { AlreadyExistsError } from "../errors/already-exists-error";

export const createAccountController: FastifyPluginAsyncZod = async (app) => {
	app.post(
		"/users",
		{
			schema: {
				summary: "Create a new account",
				tags: ["Authentication"],
				operationId: "createAccount",
				body: zpt.UserSchema.pick({
					name: true,
					email: true,
				}).extend({
					password: z.string().min(6).max(32),
				}),
				response: {
					201: z.object({
						message: z.string(),
					}),
				},
			},
		},
		async (request, reply) => {
			const { name, email, password } = request.body;

			const userWithSameEmail = await prisma.user.findUnique({
				where: { email },
			});

			if (userWithSameEmail) {
				throw new AlreadyExistsError();
			}

			const [, domain] = email.split("@");

			const organization = await prisma.organization.findFirst({
				where: { domain, shouldAttachUsersByDomain: true },
			});

			const saltRounds = await genSalt(10);
			const passwordHash = await hash(password, saltRounds);

			await prisma.user.create({
				data: {
					name,
					email,
					passwordHash,
					member_on: organization
						? {
								create: {
									organizationId: organization.id,
								},
							}
						: undefined,
				},
			});

			return reply.status(201).send({
				message: "Usuário criado com sucesso.",
			});
		},
	);
};
