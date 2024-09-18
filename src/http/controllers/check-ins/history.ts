import { z } from "zod";

import { makeListUserCheckInsHistoryUseCase } from "@/use-cases/factories/make-list-user-check-ins-history-use-case";
import type { FastifyReply, FastifyRequest } from "fastify";

export async function history(request: FastifyRequest, reply: FastifyReply) {
	const getGymHistoryQuerySchema = z.object({
		page: z.coerce.number().int().positive().default(1),
	});

	const { page } = getGymHistoryQuerySchema.parse(request.query);
	const { sub: userId } = request.user;

	const registerUseCase = makeListUserCheckInsHistoryUseCase();
	const { checkIns } = await registerUseCase.execute({ page, userId });

	return reply.status(200).send({ checkIns });
}
