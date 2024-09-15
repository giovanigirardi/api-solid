import type { CheckInsRepository } from "@/repositories/check-ins-repository";

interface CheckInUseCaseRequest {
	userId: string;
	gymId: string;
}

export class CheckInUseCase {
	constructor(private checkInsRepository: CheckInsRepository) {}

	async execute({ gymId, userId }: CheckInUseCaseRequest) {
		const checkIn = await this.checkInsRepository.create({ gym_id: gymId, user_id: userId });

		return { checkIn };
	}
}
