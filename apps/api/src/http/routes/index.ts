import type { FastifyPluginAsyncZod } from "fastify-type-provider-zod";
import { authenticateWithGithubController } from "./auth/authenticate-with-github";
import { authenticateWithPasswordController } from "./auth/authenticate-with-password";
import { createAccountController } from "./auth/create-account";
import { getProfileController } from "./auth/get-profile";
import { requestPasswordRecoverController } from "./auth/request-password-recover";
import { resetPasswordController } from "./auth/reset-password";
import { createOrganizationController } from "./orgs/create-organization";
import { getMembershipController } from "./orgs/get-membership";
import { getOrganizationController } from "./orgs/get-organization";
import { getOrganizationsController } from "./orgs/get-organizations";
import { shutdownOrganizationController } from "./orgs/shutdown-organization";
import { updateOrganizationController } from "./orgs/update-organization";

export const routes: FastifyPluginAsyncZod = async (app) => {
	app.register(createAccountController);
	app.register(authenticateWithPasswordController);
	app.register(authenticateWithGithubController);
	app.register(getProfileController);
	app.register(requestPasswordRecoverController);
	app.register(resetPasswordController);

	app.register(createOrganizationController);
	app.register(getMembershipController);
	app.register(getOrganizationController);
	app.register(getOrganizationsController);
	app.register(updateOrganizationController);
	app.register(shutdownOrganizationController);
};
