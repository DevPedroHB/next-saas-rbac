import type { FastifyPluginAsync } from "fastify";
import { createAccount } from "./auth/create-account";

export const routes: FastifyPluginAsync = async (app) => {
	app.register(createAccount);
};
