"use server";

import { actionClient } from "@/libs/safe-action";
import { signUpSchema } from "@/types/schemas/sign-up-schema";

export const signUpAction = actionClient
	.inputSchema(signUpSchema)
	.action(
		async ({ parsedInput: { name, email, password, confirmPassword } }) => {
			console.log({ name, email, password, confirmPassword });

			return {
				message: "Registro realizado com sucesso.",
			};
		},
	);
