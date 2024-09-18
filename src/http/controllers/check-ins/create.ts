import { z } from "zod";

import { makeCheckInUseCase } from "@/use-cases/factories/make-check-in-use-case";
import type { FastifyReply, FastifyRequest } from "fastify";

export async function create(request: FastifyRequest, reply: FastifyReply) {
	const createCheckInParamsSchema = z.object({
		gymId: z.string().uuid(),
	});

	const createCheckInBodySchema = z.object({
		latitude: z.number().refine((v) => Math.abs(v) <= 90),
		longitude: z.number().refine((v) => Math.abs(v) <= 180),
	});

	const { latitude, longitude } = createCheckInBodySchema.parse(request.body);
	const { gymId } = createCheckInParamsSchema.parse(request.params);
	const { sub: userId } = request.user;

	const registerUseCase = makeCheckInUseCase();
	await registerUseCase.execute({ userLatitude: latitude, userLongitude: longitude, gymId, userId });

	return reply.status(201).send();
}
