import { hash } from "bcryptjs";
import { beforeEach, describe, expect, it } from "vitest";

import { InMemoryUsersRepository } from "@/repositories/in-memory/in-memory-users-repository";

import { ResourceNotFound } from "./errors/resource-not-found";
import { GetUserProfileUseCase } from "./get-user-profile";

let usersRepository: InMemoryUsersRepository;
let sut: GetUserProfileUseCase;

describe("Get user profile use case", () => {
	beforeEach(() => {
		usersRepository = new InMemoryUsersRepository();
		sut = new GetUserProfileUseCase(usersRepository);
	});

	it("should be able to get the user profile", async () => {
		const { id } = await usersRepository.create({
			name: "John Doe",
			email: "johndoe@email.com",
			password_hash: await hash("123456", 10),
		});

		const { user } = await sut.execute({
			userId: id,
		});

		expect(user.id).toEqual(expect.any(String));
	});

	it("should throw an error if the user does not exist", async () => {
		await expect(
			sut.execute({
				userId: "user-2",
			}),
		).rejects.toBeInstanceOf(ResourceNotFound);
	});
});
