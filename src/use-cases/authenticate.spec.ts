import { hash } from "bcryptjs";
import { describe, expect, it } from "vitest";

import { InMemoryUsersRepository } from "@/repositories/in-memory/in-memory-users-repository";

import { AuthenticateUseCase } from "./authenticate";
import { InvalidCredentialsError } from "./errors/invalid-credentials";

describe("Authenticate", () => {
	it("should authenticate a user", async () => {
		const usersRepository = new InMemoryUsersRepository();
		const sut = new AuthenticateUseCase(usersRepository);

		await usersRepository.create({
			name: "John Doe",
			email: "johndoe@email.com",
			password_hash: await hash("123456", 10),
		});

		const { user } = await sut.execute({
			email: "johndoe@email.com",
			password: "123456",
		});

		expect(user.id).toEqual(expect.any(String));
	});

	it("should throw an error if the user does not exist", async () => {
		const usersRepository = new InMemoryUsersRepository();
		const sut = new AuthenticateUseCase(usersRepository);

		await expect(
			sut.execute({
				email: "johndoe@email.com",
				password: "123456",
			}),
		).rejects.toBeInstanceOf(InvalidCredentialsError);
	});

	it("should throw an error if the password is incorrect", async () => {
		const usersRepository = new InMemoryUsersRepository();
		const sut = new AuthenticateUseCase(usersRepository);

		await usersRepository.create({
			name: "John Doe",
			email: "johndoe@email.com",
			password_hash: await hash("123456", 10),
		});

		await expect(
			sut.execute({
				email: "johndoe@email.com",
				password: "12345",
			}),
		).rejects.toBeInstanceOf(InvalidCredentialsError);
	});
});
