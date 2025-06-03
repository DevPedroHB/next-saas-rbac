"use server";

import { api } from "@/libs/ky";
import { actionClient } from "@/libs/safe-action";
import { type SessionData, getServerSession } from "@/libs/session";
import { signInSchema } from "@/types/schemas/sign-in-schema";
import { redirect } from "next/navigation";

export const signInAction = actionClient
	.inputSchema(signInSchema)
	.action(async ({ parsedInput: { email, password } }) => {
		const { token } = await api
			.post("sessions/password", {
				json: {
					email,
					password,
				},
			})
			.json<SessionData>();

		const session = await getServerSession();

		session.token = token;

		await session.save();

		redirect("/");
	});
