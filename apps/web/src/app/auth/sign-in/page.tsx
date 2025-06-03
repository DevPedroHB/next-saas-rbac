import { SignInWithGithub } from "@/components/sign-in-with-github";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import type { Metadata } from "next";
import Link from "next/link";
import { SignInForm } from "./components/sign-in-form";

export const metadata: Metadata = {
	title: "Entrar",
};

export default async function SignIn() {
	return (
		<div className="space-y-4">
			<SignInForm />
			<Button type="submit" variant="link" size="sm" className="w-full" asChild>
				<Link href="/auth/sign-up">Crie uma nova conta</Link>
			</Button>
			<Separator />
			<SignInWithGithub />
		</div>
	);
}
