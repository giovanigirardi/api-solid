import { compare } from "bcryptjs";
import { describe, expect, it } from "vitest";

import { InMemoryUsersRepository } from "@/repositories/in-memory/in-memory-users-repository";

import { UserAlreadyExistsError } from "./errors/user-already-exists";
import { RegisterUseCase } from "./register";

describe("register use case", () => {
	it("should register a new user", async () => {
		const usersRepository = new InMemoryUsersRepository();
		const registerUseCase = new RegisterUseCase(usersRepository);

		const { user } = await registerUseCase.handle({
			name: "John Doe",
			email: "johndoe@email.com",
			password: "123456",
		});

		expect(user.id).toEqual(expect.any(String));
	});

	it("should hash the user password upon registration", async () => {
		const usersRepository = new InMemoryUsersRepository();
		const registerUseCase = new RegisterUseCase(usersRepository);

		const { user } = await registerUseCase.handle({
			name: "John Doe",
			email: "johndoe@email.com",
			password: "123456",
		});

		const isPasswordHashed = await compare("123456", user.password_hash);
		expect(isPasswordHashed).toBe(true);
	});

	it("should not register a user with an existing email", async () => {
		const usersRepository = new InMemoryUsersRepository();
		const registerUseCase = new RegisterUseCase(usersRepository);

		const duplicatedEmail = "johndoe@email.com";

		await registerUseCase.handle({
			name: "John Doe",
			email: duplicatedEmail,
			password: "123456",
		});

		await expect(() =>
			registerUseCase.handle({
				name: "John Doe",
				email: duplicatedEmail,
				password: "123456",
			}),
		).rejects.toBeInstanceOf(UserAlreadyExistsError);
	});
});
