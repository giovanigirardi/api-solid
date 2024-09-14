import { hash } from "bcryptjs";

import { prisma } from "@/lib/prisma";

interface RegisterUseCaseRequest {
	name: string;
	email: string;
	password: string;
}

export class RegisterUseCase {
	constructor(private usersRepository: any) {}

	async handle(params: RegisterUseCaseRequest) {
		const { name, email, password } = params;

		const userWithSameEmail = await prisma.user.findUnique({
			where: {
				email,
			},
		});

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
