import fastifyCors from "@fastify/cors";
import { fastify } from "fastify";
import {
	type ZodTypeProvider,
	serializerCompiler,
	validatorCompiler,
} from "fastify-type-provider-zod";
import { createAccount } from "./routes/auth/create-account";

const app = fastify().withTypeProvider<ZodTypeProvider>();

app.setSerializerCompiler(serializerCompiler);
app.setValidatorCompiler(validatorCompiler);

app.register(fastifyCors, {
	origin: "*",
});

app.register(createAccount);

app.listen({ port: 3333 }).then(() => {
	console.log("✅ HTTP server running on http://localhost:3333 🚀");
});
