"use client";

import { signOutAction } from "@/actions/auth/sign-out-action";
import { getQueryClient } from "@/libs/get-query-client";
import { useAction } from "next-safe-action/hooks";
import type { ComponentProps } from "react";
import { toast } from "sonner";
import {
	AlertDialog,
	AlertDialogAction,
	AlertDialogCancel,
	AlertDialogContent,
	AlertDialogDescription,
	AlertDialogFooter,
	AlertDialogHeader,
	AlertDialogTitle,
	AlertDialogTrigger,
} from "./ui/alert-dialog";

interface ISignOutDialog extends ComponentProps<typeof AlertDialogTrigger> {}

export function SignOutDialog(props: ISignOutDialog) {
	const { execute, isPending } = useAction(signOutAction, {
		onSettled() {
			const queryClient = getQueryClient();

			queryClient.removeQueries({ queryKey: ["profile"] });

			toast.success("Você saiu com sucesso. Volte sempre!");
		},
	});

	return (
		<AlertDialog>
			<AlertDialogTrigger {...props} />
			<AlertDialogContent>
				<AlertDialogHeader>
					<AlertDialogTitle>Você tem certeza absoluta?</AlertDialogTitle>
					<AlertDialogDescription>
						Tem certeza de que deseja sair? Sua sessão atual será apagada e você
						será redirecionado para a página de login.
					</AlertDialogDescription>
				</AlertDialogHeader>
				<AlertDialogFooter>
					<AlertDialogCancel type="button">Cancelar</AlertDialogCancel>
					<AlertDialogAction
						type="button"
						onClick={() => execute()}
						disabled={isPending}
					>
						Continuar
					</AlertDialogAction>
				</AlertDialogFooter>
			</AlertDialogContent>
		</AlertDialog>
	);
}
