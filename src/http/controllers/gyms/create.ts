import { z } from "zod";

import { makeCreateGymUseCase } from "@/use-cases/factories/make-create-gym-use-case";

import type { FastifyReply, FastifyRequest } from "fastify";

export async function create(request: FastifyRequest, reply: FastifyReply) {
	console.log("Gymmmmmmm");
	const createGymBodySchema = z.object({
		title: z.string(),
		description: z.string().optional(),
		phone: z.string().optional(),
		latitude: z.number().refine((v) => Math.abs(v) <= 90),
		longitude: z.number().refine((v) => Math.abs(v) <= 180),
	});

	console.log("Gym");

	const { latitude, longitude, title, description = null, phone = null } = createGymBodySchema.parse(request.body);

	const registerUseCase = makeCreateGymUseCase();
	await registerUseCase.execute({ description, latitude, longitude, phone, title });

	return reply.status(201).send();
}
