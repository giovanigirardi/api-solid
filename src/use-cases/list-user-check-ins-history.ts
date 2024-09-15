import type { CheckInsRepository } from "@/repositories/check-ins-repository";

interface ListUserCheckInsHistoryUseCaseRequest {
	userId: string;
	page: number;
}

export class ListUserCheckInsHistoryUseCase {
	constructor(private checkInsRepository: CheckInsRepository) {}

	async execute({ userId, page }: ListUserCheckInsHistoryUseCaseRequest) {
		const checkIns = await this.checkInsRepository.findManyByUserId(userId, page);

		return { checkIns };
	}
}
