"use server";

import { actionClient } from "@/libs/safe-action";
import { signInSchema } from "@/types/schemas/sign-in-schema";

export const signInAction = actionClient
	.inputSchema(signInSchema)
	.action(async ({ parsedInput: { email, password } }) => {
		console.log({ email, password });

		return {
			message: "Login realizado com sucesso.",
		};
	});
