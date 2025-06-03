import { keys } from "@/constants/keys";
import { env } from "@next-saas-rbac/env";
import { type SessionOptions, getIronSession } from "iron-session";
import { cookies } from "next/headers";

export const sessionOptions: SessionOptions = {
	password: env.SECRET_COOKIE_PASSWORD,
	cookieName: keys.TOKEN,
	ttl: 60 * 60 * 24 * 7, // 7 days
	cookieOptions: {
		secure: env.NODE_ENV === "production",
		httpOnly: true,
		sameSite: "lax",
		maxAge: 60 * 60 * 24 * 7, // 7 days
	},
};

export interface SessionData {
	token: string;
}

export async function getServerSession() {
	const cookiesStore = await cookies();

	const session = await getIronSession<SessionData>(
		cookiesStore,
		sessionOptions,
	);

	return session;
}
