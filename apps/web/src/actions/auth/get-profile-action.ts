"use server";

import { api } from "@/libs/ky";
import { actionClient } from "@/libs/safe-action";
import type { User } from "@next-saas-rbac/database";

interface GetProfileActionResponse {
	user: Omit<User, "passwordHash">;
}

export const getProfileAction = actionClient.action(async () => {
	return await api.get("profile").json<GetProfileActionResponse>();
});
