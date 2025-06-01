import type { Member, Organization } from "@next-saas-rbac/database";
import "fastify";

declare module "fastify" {
	export interface FastifyRequest {
		getCurrentUserId(): Promise<string>;
		getUserMembership(
			slug: string,
		): Promise<{ organization: Organization; membership: Member }>;
	}
}
