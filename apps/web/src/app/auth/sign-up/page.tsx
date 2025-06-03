import { SignInWithGithub } from "@/components/sign-in-with-github";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import type { Metadata } from "next";
import Link from "next/link";
import { SignUpForm } from "./components/sign-up-form";

export const metadata: Metadata = {
	title: "Inscrever-se",
};

export default function SignUp() {
	return (
		<div className="space-y-4">
			<SignUpForm />
			<Button type="button" variant="link" size="sm" className="w-full" asChild>
				<Link href="/auth/sign-in">Já registrado? Entrar</Link>
			</Button>
			<Separator />
			<SignInWithGithub />
		</div>
	);
}
