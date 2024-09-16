import { PrismaGymsRepository } from "@/repositories/prisma/prisma-gyms-repository";

import { CreateGymUseCase } from "../create-gym";

export function makeAuthenticateUseCase() {
	const gymsRepository = new PrismaGymsRepository();

	const createGymUseCase = new CreateGymUseCase(gymsRepository);

	return createGymUseCase;
}
