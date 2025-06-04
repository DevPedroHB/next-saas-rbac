"use server";

import { getQueryClient } from "@/libs/get-query-client";
import { api } from "@/libs/ky";
import { actionClient } from "@/libs/safe-action";
import type { User } from "@next-saas-rbac/database";
import { dehydrate } from "@tanstack/react-query";

export interface GetProfileResponse {
	user: Omit<User, "passwordHash">;
}

export async function getProfile() {
	return await api.get("profile").json<GetProfileResponse>();
}

export const getProfileAction = actionClient.action(async () => {
	const queryClient = getQueryClient();

	const { user } = await queryClient.fetchQuery({
		queryKey: ["profile"],
		queryFn: getProfile,
	});

	const dehydratedState = dehydrate(queryClient);

	return {
		user,
		dehydratedState,
	};
});
