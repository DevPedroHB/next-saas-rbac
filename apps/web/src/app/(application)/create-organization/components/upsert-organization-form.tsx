"use client";

import { createOrganizationAction } from "@/actions/orgs/create-organization-action";
import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import {
	Form,
	FormControl,
	FormDescription,
	FormField,
	FormItem,
	FormLabel,
	FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { createOrganizationSchema } from "@/types/schemas/create-organization-schema";
import { zodResolver } from "@hookform/resolvers/zod";
import { useHookFormAction } from "@next-safe-action/adapter-react-hook-form/hooks";
import { toast } from "sonner";

export function UpsertOrganizationForm() {
	const { form, handleSubmitWithAction, resetFormAndAction } =
		useHookFormAction(
			createOrganizationAction,
			zodResolver(createOrganizationSchema),
			{
				actionProps: {
					onSettled: ({ result }) => {
						result.serverError || result.serverError
							? toast.error("Erro ao criar organização.")
							: toast.success("Organização criada com sucesso com sucesso.");

						resetFormAndAction();
					},
				},
				formProps: {
					defaultValues: {
						name: "",
						domain: "",
						shouldAttachUsersByDomain: false,
					},
				},
			},
		);

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
								<Input
									type="text"
									placeholder="Nome da Organização"
									{...field}
								/>
							</FormControl>
							<FormMessage />
						</FormItem>
					)}
				/>
				<FormField
					control={form.control}
					name="domain"
					render={({ field }) => (
						<FormItem>
							<FormLabel>Domínio</FormLabel>
							<FormControl>
								<Input type="text" placeholder="example.com" {...field} />
							</FormControl>
							<FormMessage />
						</FormItem>
					)}
				/>
				<FormField
					control={form.control}
					name="shouldAttachUsersByDomain"
					render={({ field }) => (
						<FormItem>
							<FormControl>
								<Checkbox
									checked={field.value}
									onCheckedChange={field.onChange}
								/>
							</FormControl>
							<FormLabel>Junte-se automático a novos membros</FormLabel>
							<FormDescription>
								Isso convidará automaticamente todos os membros com o mesmo
								domínio de email para esta organização.
							</FormDescription>
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
					Salvar organização
				</Button>
			</form>
		</Form>
	);
}
