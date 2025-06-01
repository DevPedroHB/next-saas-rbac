import type { FastifyPluginAsync } from "fastify";
import { authenticateWithGithub } from "./auth/authenticate-with-github";
import { authenticateWithPassword } from "./auth/authenticate-with-password";
import { createAccount } from "./auth/create-account";
import { getProfile } from "./auth/get-profile";
import { requestPasswordRecover } from "./auth/request-password-recover";
import { resetPassword } from "./auth/reset-password";
import { createOrganization } from "./orgs/create-organization";

export const routes: FastifyPluginAsync = async (app) => {
	app.register(createAccount);
	app.register(authenticateWithPassword);
	app.register(getProfile);
	app.register(requestPasswordRecover);
	app.register(resetPassword);
	app.register(authenticateWithGithub);
	app.register(createOrganization);
};
