import { Button } from "@/components/ui/button";
import type { Metadata } from "next";
import Link from "next/link";
import { ForgotPasswordForm } from "./components/forgot-password-form";

export const metadata: Metadata = {
	title: "Esqueceu sua senha",
};

export default function ForgotPassword() {
	return (
		<div className="space-y-4">
			<ForgotPasswordForm />
			<Button type="button" variant="link" size="sm" className="w-full" asChild>
				<Link href="/auth/sign-in">Entre em vez disso</Link>
			</Button>
		</div>
	);
}
