import { ability } from "@next-saas-rbac/auth";

const userCanInviteSomeoneElse = ability.can("invite", "User");
const userCanDeleteOtherUsers = ability.can("delete", "User");

const userCannotDeleteOtherUsers = ability.cannot("delete", "User");

console.log(userCanInviteSomeoneElse, userCanDeleteOtherUsers);
console.log(userCannotDeleteOtherUsers);
