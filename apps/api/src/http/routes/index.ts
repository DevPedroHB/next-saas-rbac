import type { FastifyPluginAsync } from "fastify";
import { authenticateWithPassword } from "./auth/authenticate-with-password";
import { createAccount } from "./auth/create-account";
import { getProfile } from "./auth/get-profile";
import { requestPasswordRecover } from "./auth/request-password-recover";
import { resetPassword } from "./auth/reset-password";

export const routes: FastifyPluginAsync = async (app) => {
	app.register(createAccount);
	app.register(authenticateWithPassword);
	app.register(getProfile);
	app.register(requestPasswordRecover);
	app.register(resetPassword);
};
