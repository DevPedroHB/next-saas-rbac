import fastifyCors from "@fastify/cors";
import fastifySwagger from "@fastify/swagger";
import fastifySwaggerUI from "@fastify/swagger-ui";
import { fastify } from "fastify";
import {
  ZodTypeProvider,
  jsonSchemaTransform,
  serializerCompiler,
  validatorCompiler,
} from "fastify-type-provider-zod";
import { AddressInfo } from "net";
import { createAccount } from "./routes/auth/create-account";

const app = fastify().withTypeProvider<ZodTypeProvider>();

app.setSerializerCompiler(serializerCompiler);

app.setValidatorCompiler(validatorCompiler);

app.register(fastifySwagger, {
  swagger: {
    consumes: ["application/json"],
    produces: ["application/json"],
    info: {
      title: "Next.js SaaS",
      description: "Full-stack SaaS with multi-tenant & RBAC.",
      version: "1.0.0",
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

app.register(createAccount);

app
  .listen({
    host: "0.0.0.0",
    port: 3333,
  })
  .then(() => {
    const { port } = app.server.address() as AddressInfo;

    console.log(`🚀 HTTP server listening on port ${port}`);
  });