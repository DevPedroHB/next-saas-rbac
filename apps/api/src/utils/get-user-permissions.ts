import {
  defineAbilityFor,
  user as userSchema,
  type Role,
} from "@next-saas-rbac/auth";

export function getUserPermissions(userId: string, role: Role) {
  const authUser = userSchema.parse({
    id: userId,
    role,
  });

  const ability = defineAbilityFor(authUser);

  return ability;
}
