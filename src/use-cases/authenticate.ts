import { compare } from "bcryptjs";

import { InvalidCredentialsError } from "./errors/invalid-credentials";

import type { UsersRepository } from "@/repositories/users-repository";

interface AuthenticateUseCaseRequest {
	email: string;
	password: string;
}

export class AuthenticateUseCase {
	constructor(private userRepository: UsersRepository) {}

	async execute({ email, password }: AuthenticateUseCaseRequest) {
		const user = await this.userRepository.findByEmail(email);

		if (!user) {
			throw new InvalidCredentialsError();
		}

		const doesPasswordsMatch = await compare(password, user.password_hash);

		if (!doesPasswordsMatch) {
			throw new InvalidCredentialsError();
		}

		return { user };
	}
}
