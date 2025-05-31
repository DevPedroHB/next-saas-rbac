import { defineAbilityFor, projectSchema } from "@next-saas-rbac/auth";

const ability = defineAbilityFor({ id: "an-example-id", role: "MEMBER" });
const project = projectSchema.parse({
	id: "an-example-id",
	ownerId: "an-example-id",
});

console.log(ability.can("get", "Billing"));
console.log(ability.can("create", "Invite"));
console.log(ability.can("delete", project));
