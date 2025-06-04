"use server";

import { getQueryClient } from "@/libs/get-query-client";
import { api } from "@/libs/ky";
import { actionClient } from "@/libs/safe-action";
import { defineAbilityFor } from "@next-saas-rbac/auth";
import type { Member } from "@next-saas-rbac/database";
import { dehydrate } from "@tanstack/react-query";
import { headers } from "next/headers";

export interface GetMembershipResponse {
	membership: Member;
}

export async function getMembership(slug: string) {
	return await api
		.get(`organizations/${slug}/membership`)
		.json<GetMembershipResponse>();
}

export const getMembershipAction = actionClient.action(async () => {
	const header = await headers();
	const pathname = header.get("x-current-path") ?? "/";
	const slug = pathname.split("/")[2];

	if (!slug) return;

	const queryClient = getQueryClient();

	const { membership } = await queryClient.fetchQuery({
		queryKey: ["membership"],
		queryFn: () => getMembership(slug),
	});

	const dehydratedState = dehydrate(queryClient);

	const ability = defineAbilityFor({
		id: membership.userId,
		role: membership.role,
	});

	console.log(ability);

	return {
		membership,
		ability,
		dehydratedState,
	};
});
