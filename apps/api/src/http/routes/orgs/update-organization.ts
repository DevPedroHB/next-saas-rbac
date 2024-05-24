import { auth } from "@/http/middlewares/auth";
import { prisma } from "@/lib/prisma";
import { getUserPermissions } from "@/utils/get-user-permissions";
import { organization as organizationSchema } from "@next-saas-rbac/auth";
import type { FastifyInstance } from "fastify";
import type { ZodTypeProvider } from "fastify-type-provider-zod";
import z from "zod";
import { BadRequestError } from "../errors/bad-request-error";
import { UnAuthorizedError } from "../errors/unauthorized-error";

export async function updateOrganization(app: FastifyInstance) {
  app
    .withTypeProvider<ZodTypeProvider>()
    .register(auth)
    .put(
      "/organizations/:slug",
      {
        schema: {
          tags: ["organizations"],
          summary: "Update organization details.",
          security: [{ bearer: [] }],
          params: z.object({
            slug: z.string(),
          }),
          body: z.object({
            name: z.string(),
            domain: z.string().nullish(),
            shouldAttachUsersByDomain: z.boolean().optional(),
          }),
          response: {
            204: z.null(),
          },
        },
      },
      async (request, reply) => {
        const { slug } = request.params;
        const { name, domain, shouldAttachUsersByDomain } = request.body;

        const userId = await request.getCurrentUserId();
        const { membership, organization } =
          await request.getUserMembership(slug);

        const { cannot } = getUserPermissions(userId, membership.role);
        const authOrganization = organizationSchema.parse(organization);

        if (cannot("update", authOrganization)) {
          throw new UnAuthorizedError(
            "You're not allowed to update this organization."
          );
        }

        if (domain) {
          const organizationByDomain = await prisma.organization.findFirst({
            where: {
              domain,
              id: {
                not: organization.id,
              },
            },
          });

          if (organizationByDomain) {
            throw new BadRequestError(
              "Another organization with same domain already exists."
            );
          }
        }

        await prisma.organization.update({
          where: {
            id: organization.id,
          },
          data: {
            name,
            // slug: createSlug(name),
            domain,
            shouldAttachUsersByDomain,
          },
        });

        return reply.status(204).send();
      }
    );
}
