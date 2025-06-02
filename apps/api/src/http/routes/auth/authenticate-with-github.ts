import { prisma } from "@next-saas-rbac/database";
import { env } from "@next-saas-rbac/env";
import type { FastifyPluginAsyncZod } from "fastify-type-provider-zod";
import { z } from "zod";
import { InvalidCredentialsError } from "../errors/invalid-credentials-error";

export const authenticateWithGithubController: FastifyPluginAsyncZod = async (
	app,
) => {
	app.post(
		"/sessions/github",
		{
			schema: {
				summary: "Authenticate with Github",
				tags: ["Authentication"],
				operationId: "authenticateWithGithub",
				body: z.object({
					code: z.string(),
				}),
				response: {
					201: z.object({
						token: z.string(),
					}),
				},
			},
		},
		async (request, reply) => {
			const { code } = request.body;

			const githubOAuthURL = new URL(
				"https://github.com/login/oauth/access_token",
			);

			githubOAuthURL.searchParams.set("client_id", env.AUTH_GITHUB_ID);
			githubOAuthURL.searchParams.set("client_secret", env.AUTH_GITHUB_SECRET);
			githubOAuthURL.searchParams.set(
				"redirect_uri",
				env.AUTH_GITHUB_REDIRECT_URI,
			);
			githubOAuthURL.searchParams.set("code", code);

			const githubAccessTokenResponse = await fetch(githubOAuthURL, {
				method: "POST",
				headers: {
					Accept: "application/json",
				},
			});

			const githubAccessTokenData = await githubAccessTokenResponse.json();

			const { access_token: githubAccessToken } = z
				.object({
					access_token: z.string(),
					token_type: z.literal("bearer"),
					scope: z.string(),
				})
				.parse(githubAccessTokenData);

			const githubUserResponse = await fetch("https://api.github.com/user", {
				headers: {
					Authorization: `Bearer ${githubAccessToken}`,
				},
			});

			const githubUserData = await githubUserResponse.json();

			const {
				id: githubId,
				name,
				email,
				avatar_url: avatarUrl,
			} = z
				.object({
					id: z.number().int().transform(String),
					avatar_url: z.string().url(),
					name: z.string().nullable(),
					email: z.string().nullable(),
				})
				.parse(githubUserData);

			if (email === null) {
				throw new InvalidCredentialsError(
					"Sua conta do GitHub deve ter um e-mail para autenticação.",
				);
			}

			let user = await prisma.user.findUnique({
				where: { email },
			});

			if (!user) {
				user = await prisma.user.create({
					data: {
						email,
						name,
						avatarUrl,
					},
				});
			}

			let account = await prisma.account.findUnique({
				where: {
					provider_userId: {
						provider: "GITHUB",
						userId: user.id,
					},
				},
			});

			if (!account) {
				account = await prisma.account.create({
					data: {
						provider: "GITHUB",
						providerAccountId: githubId,
						userId: user.id,
					},
				});
			}

			const token = await reply.jwtSign(
				{
					sub: user.id,
				},
				{
					sign: {
						expiresIn: "7d", // 7 days
					},
				},
			);
			return reply.status(201).send({
				token,
			});
		},
	);
};
