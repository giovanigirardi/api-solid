import { z } from "zod";

import { makeValidateCheckInUseCase } from "@/use-cases/factories/make-validate-check-in-use-case";

import type { FastifyReply, FastifyRequest } from "fastify";

export async function validate(request: FastifyRequest, reply: FastifyReply) {
	const validateCheckInParamsSchema = z.object({
		checkInId: z.string().uuid(),
	});

	const { checkInId } = validateCheckInParamsSchema.parse(request.body);

	const registerUseCase = makeValidateCheckInUseCase();
	await registerUseCase.execute({ checkInId });

	return reply.status(204).send();
}
