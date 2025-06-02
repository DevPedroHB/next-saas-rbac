import { defineAbilityFor, userAuthSchema } from "@next-saas-rbac/auth";
import type { Role } from "@next-saas-rbac/database";

export function getUserPermissions(id: string, role: Role) {
	const authUser = userAuthSchema.parse({ id, role });

	const ability = defineAbilityFor(authUser);

	return ability;
}
