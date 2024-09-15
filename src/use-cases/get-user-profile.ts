import { ResourceNotFound } from "./errors/resource-not-found";

import type { UsersRepository } from "@/repositories/users-repository";

interface GetUserProfileUseCaseRequest {
	userId: string;
}

export class GetUserProfileUseCase {
	constructor(private userRepository: UsersRepository) {}

	async execute({ userId }: GetUserProfileUseCaseRequest) {
		const user = await this.userRepository.findById(userId);

		if (!user) {
			throw new ResourceNotFound("User");
		}

		return { user };
	}
}
