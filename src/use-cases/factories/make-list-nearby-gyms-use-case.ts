import { PrismaGymsRepository } from "@/repositories/prisma/prisma-gyms-repository";

import { ListNearbyGymUseCase } from "../list-nearby-gyms";

export function makeAuthenticateUseCase() {
	const gymsRepository = new PrismaGymsRepository();

	const listNearbyGymsUseCase = new ListNearbyGymUseCase(gymsRepository);

	return listNearbyGymsUseCase;
}
