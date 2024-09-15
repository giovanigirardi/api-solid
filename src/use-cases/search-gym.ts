import type { GymsRepository } from "@/repositories/gyms-repository";

interface SearchGymUseCaseRequest {
	query: string;
	page: number;
}

export class SearchGymUseCase {
	constructor(private gymsRepository: GymsRepository) {}

	async execute(params: SearchGymUseCaseRequest) {
		const { query, page } = params;

		const gyms = await this.gymsRepository.findManyByQuery(query, page);

		return { gyms };
	}
}
