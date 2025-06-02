import { zpt } from "@next-saas-rbac/database";
import { z } from "zod";

export const projectSubject = z.tuple([
	z.union([
		z.literal("manage"),
		z.literal("get"),
		z.literal("create"),
		z.literal("update"),
		z.literal("delete"),
	]),
	z.union([
		z.literal("Project"),
		zpt.ProjectSchema.extend({
			__typename: z.literal("Project").default("Project"),
		}),
	]),
]);

export type ProjectSubject = z.infer<typeof projectSubject>;
