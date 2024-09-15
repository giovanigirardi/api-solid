import { hash } from "bcryptjs";
import { beforeEach, describe, expect, it } from "vitest";

import { InMemoryUsersRepository } from "@/repositories/in-memory/in-memory-users-repository";

import { AuthenticateUseCase } from "./authenticate";
import { InvalidCredentialsError } from "./errors/invalid-credentials";

let usersRepository: InMemoryUsersRepository;
let sut: AuthenticateUseCase;

describe("Authenticate use case", () => {
	beforeEach(() => {
		usersRepository = new InMemoryUsersRepository();
		sut = new AuthenticateUseCase(usersRepository);
	});

	it("should authenticate a user", async () => {
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
		await expect(
			sut.execute({
				email: "johndoe@email.com",
				password: "123456",
			}),
		).rejects.toBeInstanceOf(InvalidCredentialsError);
	});

	it("should throw an error if the password is incorrect", async () => {
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
