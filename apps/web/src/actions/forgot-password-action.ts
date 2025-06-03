"use server";

import { actionClient } from "@/libs/safe-action";
import { forgotPasswordSchema } from "@/types/schemas/forgot-password-schema";

export const forgotPasswordAction = actionClient
	.inputSchema(forgotPasswordSchema)
	.action(async ({ parsedInput: { email } }) => {
		console.log({ email });

		return {
			message: "Código de recuperação de senha enviado para seu e-mail.",
		};
	});
