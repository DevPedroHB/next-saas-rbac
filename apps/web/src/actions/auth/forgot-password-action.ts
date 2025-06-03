"use server";

import { api } from "@/libs/ky";
import { actionClient } from "@/libs/safe-action";
import { forgotPasswordSchema } from "@/types/schemas/forgot-password-schema";
import { redirect } from "next/navigation";

export const forgotPasswordAction = actionClient
	.inputSchema(forgotPasswordSchema)
	.action(async ({ parsedInput: { email } }) => {
		await api.post("password/recover", {
			json: {
				email,
			},
		});

		redirect("/auth/sign-in");
	});
