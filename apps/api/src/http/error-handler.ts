import type { FastifyInstance } from "fastify";
import { ZodError } from "zod";
import { BadRequestError } from "./routes/errors/bad-request-error";
import { UnAuthorizedError } from "./routes/errors/unauthorized-error";

type FastifyErrorhandler = FastifyInstance["errorHandler"];

export const errorHandler: FastifyErrorhandler = (error, request, reply) => {
  if (error instanceof ZodError) {
    return reply.status(400).send({
      message: "Validation error.",
      errors: error.flatten().fieldErrors,
    });
  }

  if (error instanceof BadRequestError) {
    return reply.status(400).send({
      message: error.message,
    });
  }

  if (error instanceof UnAuthorizedError) {
    return reply.status(401).send({
      message: error.message,
    });
  }

  console.error(error);

  // Send error to some observability platform

  return reply.status(500).send({
    message: "Internal server error.",
  });
};
