import type { CheckInsRepository } from "@/repositories/check-ins-repository";
import dayjs from "dayjs";
import { LateCheckInError } from "./errors/late-check-in";
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

		const distanceInMinutesFromCheckInCreation = dayjs(new Date()).diff(dayjs(checkIn.created_at), "minute");

		if (distanceInMinutesFromCheckInCreation > 20) {
			throw new LateCheckInError();
		}

		checkIn.validated_at = new Date();

		await this.checkInsRepository.save(checkIn);

		return { checkIn };
	}
}
