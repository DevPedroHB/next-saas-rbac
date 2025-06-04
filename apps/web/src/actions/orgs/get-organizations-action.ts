"use server";

import { getQueryClient } from "@/libs/get-query-client";
import { api } from "@/libs/ky";
import { actionClient } from "@/libs/safe-action";
import type { Role } from "@next-saas-rbac/database";
import { dehydrate } from "@tanstack/react-query";

export interface GetOrganizationsResponse {
	organizations: {
		id: string;
		name: string;
		slug: string;
		avatarUrl: string | null;
		role: Role;
	}[];
}

export async function getOrganizations() {
	return await api.get("organizations").json<GetOrganizationsResponse>();
}

export const getOrganizationsAction = actionClient.action(async () => {
	const queryClient = getQueryClient();

	const { organizations } = await queryClient.fetchQuery({
		queryKey: ["organizations"],
		queryFn: getOrganizations,
	});

	const dehydratedState = dehydrate(queryClient);

	return {
		organizations,
		dehydratedState,
	};
});
