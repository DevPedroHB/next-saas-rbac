"use client";

import { forgotPasswordAction } from "@/actions/forgot-password-action";
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
	const { form, handleSubmitWithAction, resetFormAndAction } =
		useHookFormAction(forgotPasswordAction, zodResolver(forgotPasswordSchema), {
			actionProps: {
				onSuccess({ data }) {
					toast.success(data?.message);

					resetFormAndAction();
				},
				onError({ error }) {
					toast.error(error.thrownError?.message ?? "Erro ao recuperar senha.");

					resetFormAndAction();
				},
			},
			formProps: {
				defaultValues: {
					email: "",
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
				<Button type="submit" className="w-full">
					Recuperar senha
				</Button>
			</form>
		</Form>
	);
}
