"use server";

import { api } from "@/libs/ky";
import { actionClient } from "@/libs/safe-action";
import { createOrganizationSchema } from "@/types/schemas/create-organization-schema";

export const createOrganizationAction = actionClient
	.inputSchema(createOrganizationSchema)
	.action(
		async ({ parsedInput: { name, domain, shouldAttachUsersByDomain } }) => {
			await api.post("organizations", {
				json: {
					name,
					domain,
					shouldAttachUsersByDomain,
				},
			});
		},
	);
