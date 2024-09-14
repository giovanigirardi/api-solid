import { hash } from "bcryptjs";

import { prisma } from "@/lib/prisma";
import { PrismaUsersRepository } from "@/repositories/prisma-users-repository";

interface RegisterUseCaseRequest {
	name: string;
	email: string;
	password: string;
}

export async function registerUseCase(params: RegisterUseCaseRequest) {
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

	const prismaUsersRepository = new PrismaUsersRepository();

	await prismaUsersRepository.create({
		name,
		email,
		password_hash: passwordHash,
	});
}
