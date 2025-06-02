import type { AppAbility } from "@next-saas-rbac/auth";
import type { Member, Organization, User } from "@next-saas-rbac/database";
import "fastify";

declare module "fastify" {
	export interface FastifyRequest {
		getAuthenticatedUser(): Promise<{ user: User }>;
		getUserMembership(slug: string): Promise<{
			user: User;
			membership: Member;
			organization: Organization;
			ability: AppAbility;
		}>;
	}
}
