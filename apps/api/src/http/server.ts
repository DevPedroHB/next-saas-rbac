import fastifyCors from "@fastify/cors";
import { fastify } from "fastify";
import {
	type ZodTypeProvider,
	serializerCompiler,
	validatorCompiler,
} from "fastify-type-provider-zod";
import { routes } from "./routes";

const app = fastify().withTypeProvider<ZodTypeProvider>();

app.setSerializerCompiler(serializerCompiler);
app.setValidatorCompiler(validatorCompiler);

app.register(fastifyCors, {
	origin: "*",
});

app.register(routes, {
	prefix: "/api/v1",
});

app.listen({ port: 3333 }).then(() => {
	console.log("✅ HTTP server running on http://localhost:3333 🚀");
});
