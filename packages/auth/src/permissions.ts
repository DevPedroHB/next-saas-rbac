import { AbilityBuilder } from "@casl/ability";
import { AppAbility } from ".";
import { User } from "./models/user";
import { Role } from "./roles";
type Permissions = (user: User, builder: AbilityBuilder<AppAbility>) => void;

export const permissions: Record<Role, Permissions> = {
  ADMIN(_, { can }) {
    can("manage", "all");
  },
  MEMBER(_, { can }) {
    can("manage", "Project");
  },
  BILLING() {},
};
