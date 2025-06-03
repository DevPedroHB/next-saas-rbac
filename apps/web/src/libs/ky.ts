import { env } from "@next-saas-rbac/env";
import ky from "ky";

const prefix = "/api/v1";

export const api = ky.create({
	prefixUrl: env.API_URL.concat(prefix),
	hooks: {
		beforeRequest: [
			async (request) => {
				if (typeof window === "undefined") {
					const { getServerSession } = await import("@/libs/session");

					const session = await getServerSession();

					if (session.token) {
						request.headers.set("Authorization", `Bearer ${session.token}`);
					}
				}
			},
		],
	},
});
