import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import { GitHubDark } from "@ridemountainpig/svgl-react";
import type { Metadata } from "next";
import { SignInForm } from "./components/sign-in-form";

export const metadata: Metadata = {
	title: "Entrar",
};

export default function SignIn() {
	return (
		<div className="space-y-4">
			<SignInForm />
			<Separator />
			<Button type="button" variant="outline" className="w-full">
				<GitHubDark className="size-4" />
				Entrar com Github
			</Button>
		</div>
	);
}
