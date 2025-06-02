import { z } from "zod";
import { projectAuthSchema } from "../models/project-auth";

export const projectSubject = z.tuple([
	z.union([
		z.literal("manage"),
		z.literal("get"),
		z.literal("create"),
		z.literal("update"),
		z.literal("delete"),
	]),
	z.union([z.literal("Project"), projectAuthSchema]),
]);

export type ProjectSubject = z.infer<typeof projectSubject>;
