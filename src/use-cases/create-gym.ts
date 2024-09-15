import type { GymsRepository } from "@/repositories/gyms-repository";

interface CreateGymUseCaseRequest {
	title: string;
	description: string | null;
	phone: string | null;
	latitude: number;
	longitude: number;
}

export class CreateGymUseCase {
	constructor(private gymsRepository: GymsRepository) {}

	async execute(params: CreateGymUseCaseRequest) {
		const { title, description, phone, latitude, longitude } = params;

		const gym = await this.gymsRepository.create({
			title,
			description,
			phone,
			latitude,
			longitude,
		});

		return { gym };
	}
}
