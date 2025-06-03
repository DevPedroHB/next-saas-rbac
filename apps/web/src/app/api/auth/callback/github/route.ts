import { api } from "@/libs/ky";
import { type SessionData, getServerSession } from "@/libs/session";
import { type NextRequest, NextResponse } from "next/server";

export async function GET(request: NextRequest) {
	const searchParams = request.nextUrl.searchParams;
	const code = searchParams.get("code");

	if (!code) {
		return NextResponse.json(
			{ message: "O código Github Oauth não foi encontrado." },
			{ status: 400 },
		);
	}

	const { token } = await api
		.post("sessions/github", {
			json: {
				code,
			},
		})
		.json<SessionData>();

	const session = await getServerSession();

	session.token = token;

	await session.save();

	const redirectUrl = request.nextUrl.clone();

	redirectUrl.pathname = "/";
	redirectUrl.search = "";

	return NextResponse.redirect(redirectUrl);
}
