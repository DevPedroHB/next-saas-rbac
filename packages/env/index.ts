import { createEnv } from "@t3-oss/env-nextjs";
import { z } from "zod";

export const env = createEnv({
  server: {
    API_PORT: z.coerce.number().default(3333),
    DATABASE_URL: z.string().url(),
    JWT_SECRET: z.string(),
    GITHUB_CLIENT_ID: z.string(),
    GITHUB_CLIENT_SECRET: z.string(),
    GITHUB_REDIRECT_URI: z.string().url(),
  },
  client: {},
  shared: {},
  runtimeEnv: {
    API_PORT: process.env.API_PORT,
    DATABASE_URL: process.env.DATABASE_URL,
    JWT_SECRET: process.env.JWT_SECRET,
    GITHUB_CLIENT_ID: process.env.GITHUB_CLIENT_ID,
    GITHUB_CLIENT_SECRET: process.env.GITHUB_CLIENT_SECRET,
    GITHUB_REDIRECT_URI: process.env.GITHUB_REDIRECT_URI,
  },
  emptyStringAsUndefined: true,
});
