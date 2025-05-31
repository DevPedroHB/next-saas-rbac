import { z } from "zod";

export const inviteSubject = z.tuple([
	z.union([
		z.literal("manage"),
		z.literal("get"),
		z.literal("create"),
		z.literal("delete"),
	]),
	z.literal("Invite"),
]);

export type inviteSubject = z.infer<typeof inviteSubject>;
