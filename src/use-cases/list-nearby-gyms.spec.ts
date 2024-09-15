import { beforeEach, describe, expect, it } from "vitest";

import { InMemoryGymsRepository } from "@/repositories/in-memory/in-memory-gyms-repository";

import { ListNearbyGymUseCase } from "./list-nearby-gyms";

let gymsRepository: InMemoryGymsRepository;
let sut: ListNearbyGymUseCase;

describe("List nearby gyms use case", () => {
	beforeEach(async () => {
		gymsRepository = new InMemoryGymsRepository();
		sut = new ListNearbyGymUseCase(gymsRepository);
	});

	it("should be able to list nearby gyms", async () => {
		await gymsRepository.create({
			title: "Near Gym",
			latitude: 0,
			longitude: 0,
		});

		await gymsRepository.create({
			title: "Far Gym",
			latitude: 5,
			longitude: 5,
		});

		const { gyms } = await sut.execute({
			userLatitude: 0,
			userLongitude: 0,
		});

		expect(gyms).toHaveLength(1);
		expect(gyms[0].title).toBe("Near Gym");
	});
});
