import { zpt } from "@next-saas-rbac/database";
import { z } from "zod";

export const organizationSubject = z.tuple([
	z.union([
		z.literal("manage"),
		z.literal("update"),
		z.literal("delete"),
		z.literal("transfer_ownership"),
	]),
	z.union([
		z.literal("Organization"),
		zpt.OrganizationSchema.extend({
			__typename: z.literal("Organization").default("Organization"),
		}),
	]),
]);

export type OrganizationSubject = z.infer<typeof organizationSubject>;
