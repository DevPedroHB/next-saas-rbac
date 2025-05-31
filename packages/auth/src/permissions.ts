import type { AbilityBuilder } from "@casl/ability";
import type { AppAbility } from ".";
import type { Role, User } from "./models/user";

type DefinePermissions = (
	user: User,
	builder: AbilityBuilder<AppAbility>,
) => void;

export const permissions: Record<Role, DefinePermissions> = {
	ADMIN(_, { can }) {
		can("manage", "all");
	},
	MEMBER(_, { can }) {
		can("invite", "User");
	},
};
