import { makeGetUserMetricsUseCase } from "@/use-cases/factories/make-get-user-metrics-use-case";

import type { FastifyReply, FastifyRequest } from "fastify";

export async function metrics(request: FastifyRequest, reply: FastifyReply) {
	const { sub: userId } = request.user;

	const registerUseCase = makeGetUserMetricsUseCase();
	const { checkInsCount } = await registerUseCase.execute({ userId });

	return reply.status(200).send({ checkInsCount });
}
