import { github, githubApi } from "@/lib/axios";
import { prisma } from "@/lib/prisma";
import type { FastifyInstance } from "fastify";
import type { ZodTypeProvider } from "fastify-type-provider-zod";
import z from "zod";
import { BadRequestError } from "../errors/bad-request-error";

interface GithubAccessTokenResponse {
  access_token: string;
  token_type: string;
  scope: string;
}

interface GithubUserResponse {
  id: number;
  name?: string;
  email?: string;
  avatar_url: string;
}

export async function authenticateWithGithub(app: FastifyInstance) {
  app.withTypeProvider<ZodTypeProvider>().post(
    "/sessions/github",
    {
      schema: {
        tags: ["auth"],
        summary: "Authenticate with Github.",
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

      const accessToken = await github.post<GithubAccessTokenResponse>(
        "/login/oauth/access_token",
        null,
        {
          params: {
            client_id: process.env.GITHUB_CLIENT_ID,
            client_secret: process.env.GITHUB_CLIENT_SECRET,
            code,
            redirect_uri: process.env.GITHUB_REDIRECT_URI,
          },
          headers: {
            Accept: "application/json",
          },
        }
      );

      const githubUser = await githubApi.get<GithubUserResponse>("/user", {
        headers: {
          Authorization: `Bearer ${accessToken.data.access_token}`,
        },
      });

      const {
        id: githubId,
        name,
        email,
        avatar_url: avatarUrl,
      } = githubUser.data;

      if (!email || email === null) {
        throw new BadRequestError(
          "Your Github account must have an e-mail to authenticate."
        );
      }

      let user = await prisma.user.findUnique({
        where: {
          email,
        },
      });

      if (!user) {
        user = await prisma.user.create({
          data: {
            name,
            email,
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
            providerAccountId: String(githubId),
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
            expiresIn: "7d",
          },
        }
      );

      return reply.status(201).send({
        token,
      });
    }
  );
}
