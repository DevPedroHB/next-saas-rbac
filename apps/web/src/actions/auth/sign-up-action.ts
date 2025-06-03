"use server";

import { api } from "@/libs/ky";
import { actionClient } from "@/libs/safe-action";
import { signUpSchema } from "@/types/schemas/sign-up-schema";
import { redirect } from "next/navigation";

export const signUpAction = actionClient
	.inputSchema(signUpSchema)
	.action(async ({ parsedInput: { name, email, password } }) => {
		await api.post("users", {
			json: {
				name,
				email,
				password,
			},
		});

		redirect("/auth/sign-in");
	});
