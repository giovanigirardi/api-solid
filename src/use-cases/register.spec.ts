import { compare } from "bcryptjs";
import { beforeEach, describe, expect, it } from "vitest";

import { InMemoryUsersRepository } from "@/repositories/in-memory/in-memory-users-repository";

import { UserAlreadyExistsError } from "./errors/user-already-exists";
import { RegisterUseCase } from "./register";

let usersRepository: InMemoryUsersRepository;
let sut: RegisterUseCase;

describe("register use case", () => {
	beforeEach(() => {
		usersRepository = new InMemoryUsersRepository();
		sut = new RegisterUseCase(usersRepository);
	});

	it("should register a new user", async () => {
		const { user } = await sut.execute({
			name: "John Doe",
			email: "johndoe@email.com",
			password: "123456",
		});

		expect(user.id).toEqual(expect.any(String));
	});

	it("should hash the user password upon registration", async () => {
		const { user } = await sut.execute({
			name: "John Doe",
			email: "johndoe@email.com",
			password: "123456",
		});

		const isPasswordHashed = await compare("123456", user.password_hash);
		expect(isPasswordHashed).toBe(true);
	});

	it("should not register a user with an existing email", async () => {
		const duplicatedEmail = "johndoe@email.com";

		await sut.execute({
			name: "John Doe",
			email: duplicatedEmail,
			password: "123456",
		});

		await expect(() =>
			sut.execute({
				name: "John Doe",
				email: duplicatedEmail,
				password: "123456",
			}),
		).rejects.toBeInstanceOf(UserAlreadyExistsError);
	});
});
