"use server";

import { actionClient } from "@/libs/safe-action";
import { getServerSession } from "@/libs/session";
import { redirect } from "next/navigation";

export const signOutAction = actionClient.action(async () => {
	const session = await getServerSession();

	await session.destroy();

	redirect("/auth/sign-in");
});
