"use client";

import { signUpAction } from "@/actions/auth/sign-up-action";
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
import { signUpSchema } from "@/types/schemas/sign-up-schema";
import { zodResolver } from "@hookform/resolvers/zod";
import { useHookFormAction } from "@next-safe-action/adapter-react-hook-form/hooks";
import { toast } from "sonner";

export function SignUpForm() {
	const { form, handleSubmitWithAction, resetFormAndAction } =
		useHookFormAction(signUpAction, zodResolver(signUpSchema), {
			actionProps: {
				onSettled: ({ result }) => {
					result.serverError || result.serverError
						? toast.error("Erro ao realizar o cadastro.")
						: toast.success("Cadastro realizado com sucesso.");

					resetFormAndAction();
				},
			},
			formProps: {
				defaultValues: {
					name: "",
					email: "",
					password: "",
					confirmPassword: "",
				},
			},
		});

	const { isSubmitting } = form.formState;

	return (
		<Form {...form}>
			<form onSubmit={handleSubmitWithAction} className="space-y-4">
				<FormField
					control={form.control}
					name="name"
					render={({ field }) => (
						<FormItem>
							<FormLabel>Nome</FormLabel>
							<FormControl>
								<Input type="text" placeholder="John Doe" {...field} />
							</FormControl>
							<FormMessage />
						</FormItem>
					)}
				/>
				<FormField
					control={form.control}
					name="email"
					render={({ field }) => (
						<FormItem>
							<FormLabel>E-mail</FormLabel>
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
							<FormLabel>Senha</FormLabel>
							<FormControl>
								<Input type="password" placeholder="**********" {...field} />
							</FormControl>
							<FormMessage />
						</FormItem>
					)}
				/>
				<FormField
					control={form.control}
					name="confirmPassword"
					render={({ field }) => (
						<FormItem>
							<FormLabel>Confirme sua senha</FormLabel>
							<FormControl>
								<Input type="password" placeholder="**********" {...field} />
							</FormControl>
							<FormMessage />
						</FormItem>
					)}
				/>
				<Button
					type="submit"
					className="w-full"
					disabled={isSubmitting}
					loading={isSubmitting}
				>
					Criar uma conta
				</Button>
			</form>
		</Form>
	);
}
