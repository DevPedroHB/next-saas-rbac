import fastifyCors from "@fastify/cors";
import { fastify } from "fastify";
import {
  serializerCompiler,
  validatorCompiler,
  ZodTypeProvider,
} from "fastify-type-provider-zod";
import { AddressInfo } from "net";
import { createAccount } from "./routes/auth/create-account";

const app = fastify().withTypeProvider<ZodTypeProvider>();

app.setSerializerCompiler(serializerCompiler);

app.setValidatorCompiler(validatorCompiler);

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
