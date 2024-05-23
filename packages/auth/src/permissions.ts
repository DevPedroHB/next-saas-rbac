import { AbilityBuilder } from "@casl/ability";
import { AppAbility } from ".";
import { User } from "./models/user";

type Role = "ADMIN" | "MEMBER";
type Permissions = (user: User, builder: AbilityBuilder<AppAbility>) => void;

export const permissions: Record<Role, Permissions> = {
  ADMIN(_, { can }) {
    can("manage", "all");
  },
  MEMBER(_, { can }) {
    can("invite", "User");
    can("manage", "Project");
  },
};
