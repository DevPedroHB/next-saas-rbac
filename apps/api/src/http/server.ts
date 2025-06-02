import fastifyCors from "@fastify/cors";
import fastifyJwt from "@fastify/jwt";
import fastifySwagger from "@fastify/swagger";
import fastifySwaggerUi from "@fastify/swagger-ui";
import { env } from "@next-saas-rbac/env";
import fastify from "fastify";
import {
	type ZodTypeProvider,
	jsonSchemaTransform,
	serializerCompiler,
	validatorCompiler,
} from "fastify-type-provider-zod";
import { SwaggerTheme, SwaggerThemeNameEnum } from "swagger-themes";
import { errorHandler } from "./error-handler";
import { routes } from "./routes";

const app = fastify().withTypeProvider<ZodTypeProvider>();

app.setSerializerCompiler(serializerCompiler);
app.setValidatorCompiler(validatorCompiler);
app.setErrorHandler(errorHandler);

app.register(fastifyCors, {
	origin: true,
});

app.register(fastifyJwt, {
	secret: env.JWT_SECRET,
});

const swaggerTheme = new SwaggerTheme();
const swaggerThemeContent = swaggerTheme.getBuffer(
	SwaggerThemeNameEnum.DRACULA,
);

app.register(fastifySwagger, {
	openapi: {
		openapi: "3.0.0",
		info: {
			title: "Next.js SaaS + RBAC API",
			description:
				"This project contains all the necessary boilerplate to setup a multi-tenant SaaS with Next.js including authentication and RBAC authorization.",
			version: "1.0.0",
		},
		tags: [
			{
				name: "Authentication",
				description: "Authentication related end-points",
			},
			{ name: "Organization", description: "Organization related end-points" },
			{ name: "Project", description: "Project related end-points" },
			{ name: "Member", description: "Member related end-points" },
		],
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
	theme: {
		css: [{ filename: "theme.css", content: swaggerThemeContent }],
	},
});

app.register(routes, {
	prefix: "/api/v1",
});

app.listen({ port: env.API_PORT }).then(() => {
	console.log(`✅ HTTP server running 🚀
    Docs at http://localhost:${env.API_PORT}/docs
    API at http://localhost:${env.API_PORT}/api/v1
  `);
});
