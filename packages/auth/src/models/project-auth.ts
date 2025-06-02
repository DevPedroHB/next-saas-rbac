import { zpt } from "@next-saas-rbac/database";
import { z } from "zod";

export const projectAuthSchema = zpt.ProjectSchema.extend({
	__typename: z.literal("Project").default("Project"),
});

export type ProjectAuth = z.infer<typeof projectAuthSchema>;
