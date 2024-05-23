import { defineAbilityFor } from "@next-saas-rbac/auth";

const ability = defineAbilityFor({ role: "MEMBER" });

const userCanInviteSomeoneElse = ability.can("invite", "User");
const userCanDeleteOtherUser = ability.can("delete", "User");

const userCannotDeleteOtherUsers = ability.cannot("delete", "User");

console.log({
  userCanInviteSomeoneElse,
  userCanDeleteOtherUser,
  userCannotDeleteOtherUsers,
});
