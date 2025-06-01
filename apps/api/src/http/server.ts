import fastifyCors from "@fastify/cors";
import fastifyJwt from "@fastify/jwt";
import fastifySwagger from "@fastify/swagger";
import fastifySwaggerUi from "@fastify/swagger-ui";
import { env } from "@next-saas-rbac/env";
import { fastify } from "fastify";
import {
	type ZodTypeProvider,
	jsonSchemaTransform,
	serializerCompiler,
	validatorCompiler,
} from "fastify-type-provider-zod";
import { errorHandler } from "./error-handler";
import { routes } from "./routes";

const app = fastify().withTypeProvider<ZodTypeProvider>();

app.setSerializerCompiler(serializerCompiler);

app.setValidatorCompiler(validatorCompiler);

app.setErrorHandler(errorHandler);

app.register(fastifyCors, {
	origin: "*",
});

app.register(fastifySwagger, {
	openapi: {
		info: {
			title: "Next.js SaaS + RBAC API",
			description:
				"This project contains all the necessary boilerplate to setup a multi-tenant SaaS with Next.js including authentication and RBAC authorization.",
			version: "1.0.0",
		},
		components: {
			securitySchemes: {
				bearerAuth: {
					type: "http",
					scheme: "bearer",
					bearerFormat: "JWT",
				},
			},
		},
	},
	transform: jsonSchemaTransform,
});

app.register(fastifySwaggerUi, {
	routePrefix: "/docs",
});

app.register(fastifyJwt, {
	secret: env.JWT_SECRET,
});

app.register(routes, {
	prefix: "/api/v1",
});

app.listen({ port: env.API_PORT }).then(() => {
	console.log(`✅ HTTP server running on http://localhost:${env.API_PORT} 🚀`);
});
