"use server";

import { actionClient } from "@/libs/safe-action";
import { env } from "@next-saas-rbac/env";
import { redirect } from "next/navigation";

export const signInWithGithubAction = actionClient.action(async () => {
	const githubSignInURL = new URL(
		"login/oauth/authorize",
		"https://github.com",
	);

	githubSignInURL.searchParams.set("client_id", env.AUTH_GITHUB_ID);
	githubSignInURL.searchParams.set(
		"redirect_uri",
		env.AUTH_GITHUB_REDIRECT_URI,
	);
	githubSignInURL.searchParams.set("scope", "user");

	redirect(githubSignInURL.toString());
});
