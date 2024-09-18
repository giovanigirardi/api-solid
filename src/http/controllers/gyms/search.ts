import { z } from "zod";

import { makeSearchGymUseCase } from "@/use-cases/factories/make-search-gym-use-case";

import type { FastifyReply, FastifyRequest } from "fastify";

export async function search(request: FastifyRequest, reply: FastifyReply) {
	const searchGymQuerySchema = z.object({
		q: z.string(),
		page: z.coerce.number().int().positive().default(1),
	});

	const { page, q } = searchGymQuerySchema.parse(request.body);

	const registerUseCase = makeSearchGymUseCase();
	const { gyms } = await registerUseCase.execute({ page, query: q });

	return reply.status(201).send({ gyms });
}
