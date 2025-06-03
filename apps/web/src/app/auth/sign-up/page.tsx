import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import { GitHubDark } from "@ridemountainpig/svgl-react";
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
			<Button type="button" variant="outline" className="w-full">
				<GitHubDark className="size-4" />
				Inscreva-se com o GitHub
			</Button>
		</div>
	);
}
