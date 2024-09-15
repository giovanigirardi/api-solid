import type { GymsRepository } from "@/repositories/gyms-repository";

interface ListNearbyGymUseCaseRequest {
	userLatitude: number;
	userLongitude: number;
}

export class ListNearbyGymUseCase {
	constructor(private gymsRepository: GymsRepository) {}

	async execute(params: ListNearbyGymUseCaseRequest) {
		const { userLatitude, userLongitude } = params;

		const gyms = await this.gymsRepository.findManyNearby({ latitude: userLatitude, longitude: userLongitude });

		return { gyms };
	}
}
