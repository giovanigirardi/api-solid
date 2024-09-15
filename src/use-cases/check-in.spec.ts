import { beforeEach, describe, expect, it } from "vitest";

import { InMemoryCheckInsRepository } from "@/repositories/in-memory/in-memory-check-ins.repository";
import { CheckInUseCase } from "./check-in";

let usersRepository: InMemoryCheckInsRepository;
let sut: CheckInUseCase;

describe("register use case", () => {
	beforeEach(() => {
		usersRepository = new InMemoryCheckInsRepository();
		sut = new CheckInUseCase(usersRepository);
	});

	it("should register a new check in", async () => {
		const { checkIn } = await sut.execute({
			userId: "user-1",
			gymId: "gym-1",
		});

		expect(checkIn.id).toEqual(expect.any(String));
	});
});
