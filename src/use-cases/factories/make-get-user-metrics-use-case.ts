import { PrismaCheckInsRepository } from "@/repositories/prisma/prisma-check-ins-repository";

import { GetUserMetricsUseCase } from "../get-user-metrics";

export function makeAuthenticateUseCase() {
	const checkInsRepository = new PrismaCheckInsRepository();
	const getUserMetricsUseCase = new GetUserMetricsUseCase(checkInsRepository);

	return getUserMetricsUseCase;
}
