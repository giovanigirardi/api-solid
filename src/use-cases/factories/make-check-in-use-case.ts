import { PrismaCheckInsRepository } from "@/repositories/prisma/prisma-check-ins-repository";
import { PrismaGymsRepository } from "@/repositories/prisma/prisma-gyms-repository";

import { CheckInUseCase } from "../check-in";

export function makeAuthenticateUseCase() {
	const checkInsRepository = new PrismaCheckInsRepository();
	const gymsRepository = new PrismaGymsRepository();

	const checkInUseCase = new CheckInUseCase(checkInsRepository, gymsRepository);

	return checkInUseCase;
}
