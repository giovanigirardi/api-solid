import { beforeEach, describe, expect, it } from "vitest";

import { InMemoryGymsRepository } from "@/repositories/in-memory/in-memory-gyms-repository";

import { CreateGymUseCase } from "./create-gym";

let gymsRepository: InMemoryGymsRepository;
let sut: CreateGymUseCase;

describe("Create gym use case", () => {
	beforeEach(() => {
		gymsRepository = new InMemoryGymsRepository();
		sut = new CreateGymUseCase(gymsRepository);
	});

	it("should register a new gym", async () => {
		const { gym } = await sut.execute({
			title: "Academia",
			description: null,
			phone: null,
			latitude: 0,
			longitude: 0,
		});

		expect(gym.id).toEqual(expect.any(String));
	});
});
