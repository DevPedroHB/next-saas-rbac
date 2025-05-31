import {
	AbilityBuilder,
	type CreateAbility,
	type MongoAbility,
	createMongoAbility,
} from "@casl/ability";
import { z } from "zod";
import type { User } from "./models/user";
import { permissions } from "./permissions";
import { billingSubject } from "./subjects/billing-subject";
import { inviteSubject } from "./subjects/invite-subject";
import { organizationSubject } from "./subjects/organization-subject";
import { projectSubject } from "./subjects/project-subject";
import { userSubject } from "./subjects/user-subject";

const appAbilitiesSchema = z.union([
	projectSubject,
	userSubject,
	organizationSubject,
	inviteSubject,
	billingSubject,
	z.tuple([z.literal("manage"), z.literal("all")]),
]);

type AppAbilities = z.infer<typeof appAbilitiesSchema>;

export type AppAbility = MongoAbility<AppAbilities>;

export const createAppAbility = createMongoAbility as CreateAbility<AppAbility>;

export function defineAbilityFor(user: User) {
	const builder = new AbilityBuilder(createAppAbility);

	if (typeof permissions[user.role] !== "function") {
		throw new Error(`Permissions for role ${user.role} not found.`);
	}

	permissions[user.role](user, builder);

	const ability = builder.build({
		detectSubjectType(subject) {
			return subject.__typename;
		},
	});

	ability.can = ability.can.bind(ability);
	ability.cannot = ability.cannot.bind(ability);

	return ability;
}
