"use client";

import { signInWithGithubAction } from "@/actions/auth/sign-in-with-github-action";
import { Button } from "@/components/ui/button";
import { GitHubDark } from "@ridemountainpig/svgl-react";
import { useAction } from "next-safe-action/hooks";

export function SignInWithGithub() {
	const { execute, isPending } = useAction(signInWithGithubAction);

	return (
		<Button
			type="button"
			variant="outline"
			onClick={() => execute()}
			disabled={isPending}
			loading={isPending}
			className="w-full"
		>
			<GitHubDark className="size-4" />
			Entrar com o GitHub
		</Button>
	);
}
