import { zpt } from "@next-saas-rbac/database";
import type { z } from "zod";

export const userAuthSchema = zpt.UserSchema.pick({
	id: true,
}).extend({
	role: zpt.RoleSchema,
});

export type UserAuth = z.infer<typeof userAuthSchema>;
