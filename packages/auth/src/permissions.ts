import type { AbilityBuilder } from "@casl/ability";
import type { AppAbility } from "./app-ability";
import type { User } from "./models/user";
import type { Role } from "./roles";

type Permissions = (user: User, builder: AbilityBuilder<AppAbility>) => void;

export const permissions: Record<Role, Permissions> = {
	ADMIN(user, { can, cannot }) {
		can("manage", "all");
		cannot(["transfer_ownership", "update"], "Organization");
		can(["transfer_ownership", "update"], "Organization", {
			ownerId: { $eq: user.id },
		});
	},
	MEMBER(user, { can }) {
		can("get", "User");
		can(["create", "get"], "Project");
		can(["update", "delete"], "Project", { ownerId: { $eq: user.id } });
	},
	BILLING(_, { can }) {
		can("manage", "Billing");
	},
};
