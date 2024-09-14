import { hash } from "bcryptjs";

import { UserAlreadyExistsError } from "./errors/user-already-exists";

import type { UsersRepository } from "@/repositories/users-repository";

interface RegisterUseCaseRequest {
	name: string;
	email: string;
	password: string;
}

export class RegisterUseCase {
	constructor(private usersRepository: UsersRepository) {}

	async handle(params: RegisterUseCaseRequest) {
		const { name, email, password } = params;

		const userWithSameEmail = await this.usersRepository.findByEmail(email);

		if (userWithSameEmail) {
			throw new UserAlreadyExistsError();
		}

		const passwordHash = await hash(password, 10);

		await this.usersRepository.create({
			name,
			email,
			password_hash: passwordHash,
		});
	}
}
