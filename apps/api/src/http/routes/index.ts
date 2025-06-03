import type { FastifyPluginAsyncZod } from "fastify-type-provider-zod";
import { authenticateWithGithubController } from "./auth/authenticate-with-github";
import { authenticateWithPasswordController } from "./auth/authenticate-with-password";
import { createAccountController } from "./auth/create-account";
import { getProfileController } from "./auth/get-profile";
import { requestPasswordRecoverController } from "./auth/request-password-recover";
import { resetPasswordController } from "./auth/reset-password";
import { acceptInviteController } from "./invites/accept-invite";
import { createInviteController } from "./invites/create-invite";
import { getInviteController } from "./invites/get-invite";
import { getInvitesController } from "./invites/get-invites";
import { getPendingInvitesController } from "./invites/get-pending-invites";
import { rejectInviteController } from "./invites/reject-invite";
import { revokeInviteController } from "./invites/revoke-invite";
import { getMembersController } from "./members/get-members";
import { removeMemberController } from "./members/remove-member";
import { updateMemberController } from "./members/update-member";
import { createOrganizationController } from "./orgs/create-organization";
import { getMembershipController } from "./orgs/get-membership";
import { getOrganizationController } from "./orgs/get-organization";
import { getOrganizationsController } from "./orgs/get-organizations";
import { shutdownOrganizationController } from "./orgs/shutdown-organization";
import { transferOrganizationController } from "./orgs/transfer-organization";
import { updateOrganizationController } from "./orgs/update-organization";
import { createProjectController } from "./projects/create-project";
import { deleteProjectController } from "./projects/delete-project";
import { getProjectController } from "./projects/get-project";
import { getProjectsController } from "./projects/get-projects";
import { updateProjectController } from "./projects/update-project";

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
	app.register(transferOrganizationController);

	app.register(createProjectController);
	app.register(deleteProjectController);
	app.register(getProjectController);
	app.register(getProjectsController);
	app.register(updateProjectController);

	app.register(getMembersController);
	app.register(updateMemberController);
	app.register(removeMemberController);

	app.register(createInviteController);
	app.register(getInviteController);
	app.register(getInvitesController);
	app.register(acceptInviteController);
	app.register(rejectInviteController);
	app.register(revokeInviteController);
	app.register(getPendingInvitesController);
};
