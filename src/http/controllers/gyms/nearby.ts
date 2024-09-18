import { z } from "zod";

import { makeListNearbyGymsUseCase } from "@/use-cases/factories/make-list-nearby-gyms-use-case";

import type { FastifyReply, FastifyRequest } from "fastify";

export async function nearby(request: FastifyRequest, reply: FastifyReply) {
	const nearbyGymsQuerySchema = z.object({
		latitude: z.number().refine((v) => Math.abs(v) <= 90),
		longitude: z.number().refine((v) => Math.abs(v) <= 180),
	});

	const { latitude, longitude } = nearbyGymsQuerySchema.parse(request.body);

	const registerUseCase = makeListNearbyGymsUseCase();
	const { gyms } = await registerUseCase.execute({ userLatitude: latitude, userLongitude: longitude });

	return reply.status(201).send({ gyms });
}
