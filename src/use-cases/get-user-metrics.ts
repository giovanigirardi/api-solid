import type { CheckInsRepository } from "@/repositories/check-ins-repository";

interface GetUserMetricsUseCaseRequest {
	userId: string;
}

export class GetUserMetricsUseCase {
	constructor(private checkInsRepository: CheckInsRepository) {}

	async execute({ userId }: GetUserMetricsUseCaseRequest) {
		const checkInsCount = await this.checkInsRepository.countByUserId(userId);

		return { checkInsCount };
	}
}
