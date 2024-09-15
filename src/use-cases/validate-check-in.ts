import type { CheckInsRepository } from "@/repositories/check-ins-repository";
import { ResourceNotFound } from "./errors/resource-not-found";

interface ValidateCheckInUseCaseRequest {
	checkInId: string;
}

export class ValidateCheckInUseCase {
	constructor(private checkInsRepository: CheckInsRepository) {}

	async execute({ checkInId }: ValidateCheckInUseCaseRequest) {
		const checkIn = await this.checkInsRepository.findById(checkInId);

		if (!checkIn) {
			throw new ResourceNotFound("Check-in");
		}

		checkIn.validated_at = new Date();

		await this.checkInsRepository.save(checkIn);

		return { checkIn };
	}
}
