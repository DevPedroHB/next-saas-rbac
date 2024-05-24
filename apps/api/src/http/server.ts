import fastifyCors from "@fastify/cors";
import fastifyJwt from "@fastify/jwt";
import fastifySwagger from "@fastify/swagger";
import fastifySwaggerUI from "@fastify/swagger-ui";
import { env } from "@next-saas-rbac/env";
import { fastify } from "fastify";
import {
  ZodTypeProvider,
  jsonSchemaTransform,
  serializerCompiler,
  validatorCompiler,
} from "fastify-type-provider-zod";
import { AddressInfo } from "net";
import { errorHandler } from "./error-handler";
import { authenticateWithGithub } from "./routes/auth/authenticate-with-github";
import { authenticateWithPassword } from "./routes/auth/authenticate-with-password";
import { createAccount } from "./routes/auth/create-account";
import { getProfile } from "./routes/auth/get-profile";
import { requestPasswordRecover } from "./routes/auth/request-password-recover";
import { resetPassword } from "./routes/auth/reset-password";
import { createOrganization } from "./routes/orgs/create-organization";
import { getMembership } from "./routes/orgs/get-membership";
import { getOrganization } from "./routes/orgs/get-organization";
import { getOrganizations } from "./routes/orgs/get-organizations";
import { shutdownOrganization } from "./routes/orgs/shutdown-organization";
import { transferOrganization } from "./routes/orgs/transfer-organization";
import { updateOrganization } from "./routes/orgs/update-organization";
import { createProject } from "./routes/projects/create-project";
import { deleteProject } from "./routes/projects/delete-project";

const app = fastify().withTypeProvider<ZodTypeProvider>();

app.setSerializerCompiler(serializerCompiler);

app.setValidatorCompiler(validatorCompiler);

app.setErrorHandler(errorHandler);

app.register(fastifySwagger, {
  openapi: {
    info: {
      title: "Next.js SaaS",
      description: "Full-stack SaaS with multi-tenant & RBAC.",
      version: "1.0.0",
    },
    components: {
      securitySchemes: {
        bearer: {
          type: "http",
          scheme: "bearer",
          bearerFormat: "JWT",
        },
      },
    },
  },
  transform: jsonSchemaTransform,
});

app.register(fastifySwaggerUI, {
  routePrefix: "/docs",
});

app.register(fastifyCors, {
  origin: "*",
});

app.register(fastifyJwt, {
  secret: env.JWT_SECRET,
});

// Auth
app.register(createAccount);
app.register(authenticateWithPassword);
app.register(getProfile);
app.register(requestPasswordRecover);
app.register(resetPassword);
app.register(authenticateWithGithub);
// Organizations
app.register(createOrganization);
app.register(getMembership);
app.register(getOrganization);
app.register(getOrganizations);
app.register(updateOrganization);
app.register(shutdownOrganization);
app.register(transferOrganization);
// Projects
app.register(createProject);
app.register(deleteProject);

app
  .listen({
    host: "0.0.0.0",
    port: env.API_PORT,
  })
  .then(() => {
    const { port } = app.server.address() as AddressInfo;

    console.log(`🚀 HTTP server listening on port ${port}`);
  });
