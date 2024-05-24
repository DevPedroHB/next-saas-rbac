import { auth } from "@/http/middlewares/auth";
import { role } from "@next-saas-rbac/auth";
import type { FastifyInstance } from "fastify";
import type { ZodTypeProvider } from "fastify-type-provider-zod";
import z from "zod";

export async function getMembership(app: FastifyInstance) {
  app
    .withTypeProvider<ZodTypeProvider>()
    .register(auth)
    .get(
      "/organizations/:slug/membership",
      {
        schema: {
          tags: ["organizations"],
          summary: "Get user membership on organization.",
          security: [{ bearer: [] }],
          params: z.object({
            slug: z.string(),
          }),
          response: {
            200: z.object({
              membership: z.object({
                id: z.string().uuid(),
                role,
                organizationId: z.string().uuid(),
              }),
            }),
          },
        },
      },
      async (request, reply) => {
        const { slug } = request.params;

        const { membership } = await request.getUserMembership(slug);

        return reply.status(200).send({
          membership: {
            id: membership.id,
            role: role.parse(membership.role),
            organizationId: membership.organizationId,
          },
        });
      }
    );
}
