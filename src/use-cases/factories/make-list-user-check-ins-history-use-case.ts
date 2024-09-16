import { PrismaCheckInsRepository } from "@/repositories/prisma/prisma-check-ins-repository";

import { ListUserCheckInsHistoryUseCase } from "../list-user-check-ins-history";

export function makeAuthenticateUseCase() {
	const checkInsRepository = new PrismaCheckInsRepository();

	const listUserCheckInsHistoryUseCase = new ListUserCheckInsHistoryUseCase(checkInsRepository);

	return listUserCheckInsHistoryUseCase;
}
