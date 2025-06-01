import type { FastifyPluginAsync } from "fastify";
import { authenticateWithPassword } from "./auth/authenticate-with-password";
import { createAccount } from "./auth/create-account";

export const routes: FastifyPluginAsync = async (app) => {
	app.register(createAccount);
	app.register(authenticateWithPassword);
};
