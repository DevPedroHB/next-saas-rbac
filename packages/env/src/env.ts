import { createEnv } from "@t3-oss/env-core";
import { z } from "zod";

export const env = createEnv({
	server: {
		API_PORT: z.coerce.number().default(3333),
		JWT_SECRET: z.string(),
		DATABASE_URL: z.string().url(),
		AUTH_GITHUB_ID: z.string(),
		AUTH_GITHUB_SECRET: z.string(),
		AUTH_GITHUB_REDIRECT_URI: z.string().url(),
	},
	clientPrefix: "NEXT_PUBLIC_",
	client: {},
	shared: {},
	runtimeEnv: process.env,
	emptyStringAsUndefined: true,
});
