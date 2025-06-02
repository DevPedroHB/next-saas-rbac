import { zpt } from "@next-saas-rbac/database";
import { z } from "zod";

export const organizationAuthSchema = zpt.OrganizationSchema.extend({
	__typename: z.literal("Organization").default("Organization"),
});

export type OrganizationAuth = z.infer<typeof organizationAuthSchema>;
