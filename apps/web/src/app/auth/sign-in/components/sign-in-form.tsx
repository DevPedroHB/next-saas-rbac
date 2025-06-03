"use client";

import { signInAction } from "@/actions/sign-in-action";
import { Button } from "@/components/ui/button";
import {
	Form,
	FormControl,
	FormField,
	FormItem,
	FormLabel,
	FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { signInSchema } from "@/types/schemas/sign-in-schema";
import { zodResolver } from "@hookform/resolvers/zod";
import { useHookFormAction } from "@next-safe-action/adapter-react-hook-form/hooks";
import Link from "next/link";
import { toast } from "sonner";

export function SignInForm() {
	const { form, handleSubmitWithAction, resetFormAndAction } =
		useHookFormAction(signInAction, zodResolver(signInSchema), {
			actionProps: {
				onSuccess({ data }) {
					toast.success(data?.message);

					resetFormAndAction();
				},
				onError({ error }) {
					toast.error(
						error.thrownError?.message ?? "Erro ao realizar o login.",
					);

					resetFormAndAction();
				},
			},
			formProps: {
				defaultValues: {
					email: "",
					password: "",
				},
			},
		});

	return (
		<Form {...form}>
			<form onSubmit={handleSubmitWithAction} className="space-y-4">
				<FormField
					control={form.control}
					name="email"
					render={({ field }) => (
						<FormItem>
							<FormLabel>Email</FormLabel>
							<FormControl>
								<Input
									type="email"
									placeholder="email@example.com"
									{...field}
								/>
							</FormControl>
							<FormMessage />
						</FormItem>
					)}
				/>
				<FormField
					control={form.control}
					name="password"
					render={({ field }) => (
						<FormItem>
							<FormLabel className="justify-between">
								Senha
								<Link href="/auth/forgot-password" className="hover:underline">
									Esqueceu sua senha?
								</Link>
							</FormLabel>
							<FormControl>
								<Input type="password" placeholder="**********" {...field} />
							</FormControl>
							<FormMessage />
						</FormItem>
					)}
				/>
				<Button type="submit" className="w-full">
					Entrar com email
				</Button>
			</form>
		</Form>
	);
}
