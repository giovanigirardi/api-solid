import { hash } from "bcryptjs";

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
			throw new Error("Email already exists");
		}

		const passwordHash = await hash(password, 10);

		await this.usersRepository.create({
			name,
			email,
			password_hash: passwordHash,
		});
	}
}
