import type { AbilityBuilder } from "@casl/ability";
import type { AppAbility } from "./app-ability";
import type { User } from "./models/user";
import type { Role } from "./roles";

type DefinePermissions = (
	user: User,
	builder: AbilityBuilder<AppAbility>,
) => void;

export const permissions: Record<Role, DefinePermissions> = {
	ADMIN(_, { can }) {
		can("manage", "all");
	},
	MEMBER(_, { can }) {
		// can("invite", "User");
		can("manage", "Project");
	},
	BILLING() {},
};
