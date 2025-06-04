import { z } from "zod";

export const createOrganizationSchema = z.object({
	name: z.string(),
	domain: z.string().url(),
	shouldAttachUsersByDomain: z.boolean(),
});
