import type { FastifyInstance } from "fastify";
import {
	hasZodFastifySchemaValidationErrors,
	isResponseSerializationError,
} from "fastify-type-provider-zod";
import { ZodError } from "zod";
import { AlreadyExistsError } from "./routes/errors/already-exists-error";
import { InvalidCredentialsError } from "./routes/errors/invalid-credentials-error";
import { NotAllowedError } from "./routes/errors/not-allowed-error";
import { ResourceNotFoundError } from "./routes/errors/resource-not-found-error";
import { UnauthorizedError } from "./routes/errors/unauthorized-error";

type FastifyErrorHandler = FastifyInstance["errorHandler"];

const customErrors = [
	AlreadyExistsError,
	InvalidCredentialsError,
	NotAllowedError,
	ResourceNotFoundError,
	UnauthorizedError,
];

export const errorHandler: FastifyErrorHandler = (error, _request, reply) => {
	if (hasZodFastifySchemaValidationErrors(error)) {
		return reply.status(400).send({
			message: "Erro de validação de entrada.",
			errors: error.validation.map((issue) => issue.message),
		});
	}

	if (isResponseSerializationError(error)) {
		return reply.status(500).send({
			message: "Erro ao serializar a resposta.",
			errors: error.cause.issues.map((issue) => issue.message),
		});
	}

	if (error instanceof ZodError) {
		return reply.status(400).send({
			message: "Erro de validação.",
			errors: error.flatten().fieldErrors,
		});
	}

	for (const customError of customErrors) {
		if (error instanceof customError) {
			return reply.status(error.statusCode).send({ message: error.message });
		}
	}

	console.error(error);

	return reply.status(500).send({ message: "Erro interno do servidor." });
};
