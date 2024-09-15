import { beforeEach, describe, expect, it } from "vitest";

import { InMemoryGymsRepository } from "@/repositories/in-memory/in-memory-gyms-repository";
import { SearchGymUseCase } from "./search-gym";

let gymsRepository: InMemoryGymsRepository;
let sut: SearchGymUseCase;

describe("Search gym use case", () => {
	beforeEach(async () => {
		gymsRepository = new InMemoryGymsRepository();
		sut = new SearchGymUseCase(gymsRepository);
	});

	it("should be able to search for gyms", async () => {
		await gymsRepository.create({
			title: "Academia 1",
			latitude: 0,
			longitude: 0,
		});

		await gymsRepository.create({
			title: "Academia 2",
			latitude: 0,
			longitude: 0,
		});

		const { gyms } = await sut.execute({
			query: "Academia 1",
			page: 1,
		});

		expect(gyms).toHaveLength(1);
	});

	it("should be able to paginate the list of user check in history", async () => {
		for (let i = 0; i < 22; i++) {
			await gymsRepository.create({
				title: `gym-${i + 1}`,
				latitude: 0,
				longitude: 0,
			});
		}

		const { gyms } = await sut.execute({
			query: "gym",
			page: 2,
		});

		expect(gyms).toHaveLength(2);
		expect(gyms).toEqual([expect.objectContaining({ title: "gym-21" }), expect.objectContaining({ title: "gym-22" })]);
	});
});
