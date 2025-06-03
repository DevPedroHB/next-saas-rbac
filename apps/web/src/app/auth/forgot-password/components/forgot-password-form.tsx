"use client";

import { forgotPasswordAction } from "@/actions/auth/forgot-password-action";
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
import { forgotPasswordSchema } from "@/types/schemas/forgot-password-schema";
import { zodResolver } from "@hookform/resolvers/zod";
import { useHookFormAction } from "@next-safe-action/adapter-react-hook-form/hooks";
import { toast } from "sonner";

export function ForgotPasswordForm() {
	const { form, handleSubmitWithAction, resetFormAndAction, action } =
		useHookFormAction(forgotPasswordAction, zodResolver(forgotPasswordSchema), {
			actionProps: {
				onSettled: ({ result }) => {
					result.serverError || result.validationErrors
						? toast.error("Erro ao recuperar a senha.")
						: toast.success(
								"Código de recuperação de senha enviado para seu e-mail.",
							);

					resetFormAndAction();
				},
			},
			formProps: {
				defaultValues: {
					email: "",
				},
			},
		});

	const { isSubmitting } = form.formState;

	return (
		<Form {...form}>
			<form onSubmit={handleSubmitWithAction} className="space-y-4">
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
				<Button
					type="submit"
					className="w-full"
					disabled={isSubmitting}
					loading={isSubmitting}
				>
					Recuperar senha
				</Button>
			</form>
		</Form>
	);
}
