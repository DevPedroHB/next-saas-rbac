import { createEnv } from "@t3-oss/env-core";
import { z } from "zod";

export const env = createEnv({
	server: {
		NODE_ENV: z
			.enum(["development", "test", "production"])
			.default("development"),
		API_PORT: z.coerce.number().default(3333),
		API_URL: z.string().url().default("http://localhost:3333"),
		JWT_SECRET: z.string(),
		DATABASE_URL: z.string().url(),
		AUTH_GITHUB_ID: z.string(),
		AUTH_GITHUB_SECRET: z.string(),
		AUTH_GITHUB_REDIRECT_URI: z.string().url(),
		SECRET_COOKIE_PASSWORD: z.string(),
	},
	clientPrefix: "NEXT_PUBLIC_",
	client: {},
	shared: {},
	runtimeEnv: process.env,
	emptyStringAsUndefined: true,
});
