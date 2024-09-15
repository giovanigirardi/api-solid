import type { CheckInsRepository } from "@/repositories/check-ins-repository";
import type { GymsRepository } from "@/repositories/gyms-repository";
import { getDistanceBetweenCoordinates } from "@/utils/get-distance-between-coordinates";
import { ResourceNotFound } from "./errors/resource-not-found";

interface CheckInUseCaseRequest {
	userId: string;
	gymId: string;
	userLatitude: number;
	userLongitude: number;
}

const MAX_DISTANCE_IN_KILOMETERS = 0.1; // 100 meters

export class CheckInUseCase {
	constructor(
		private checkInsRepository: CheckInsRepository,
		private gymsRepository: GymsRepository,
	) {}

	async execute({ gymId, userId, userLatitude, userLongitude }: CheckInUseCaseRequest) {
		const gym = await this.gymsRepository.findById(gymId);

		if (!gym) {
			throw new ResourceNotFound("Gym");
		}

		// calculate distance between user and gym
		const distance = getDistanceBetweenCoordinates(
			{ latitude: userLatitude, longitude: userLongitude },
			{ latitude: Number(gym.latitude), longitude: Number(gym.longitude) },
		);

		if (distance > MAX_DISTANCE_IN_KILOMETERS) {
			throw new Error("User is too far from the gym");
		}

		const checkInOnSameDay = await this.checkInsRepository.findByUserIdOnDate(userId, new Date());

		if (checkInOnSameDay) {
			throw new Error("User already checked in today");
		}

		const checkIn = await this.checkInsRepository.create({ gym_id: gymId, user_id: userId });

		return { checkIn };
	}
}
