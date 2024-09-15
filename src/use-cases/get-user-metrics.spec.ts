import { beforeEach, describe, expect, it } from "vitest";

import { InMemoryCheckInsRepository } from "@/repositories/in-memory/in-memory-check-ins-repository";
import { GetUserMetricsUseCase } from "./get-user-metrics";

let checkInsRepository: InMemoryCheckInsRepository;
let sut: GetUserMetricsUseCase;

describe("get user metrics use case", () => {
	beforeEach(async () => {
		checkInsRepository = new InMemoryCheckInsRepository();
		sut = new GetUserMetricsUseCase(checkInsRepository);
	});

	it("should be able to count user check ins", async () => {
		await checkInsRepository.create({
			gym_id: "gym-1",
			user_id: "user-1",
		});

		await checkInsRepository.create({
			gym_id: "gym-2",
			user_id: "user-1",
		});

		const { checkInsCount } = await sut.execute({
			userId: "user-1",
		});

		expect(checkInsCount).toBe(2);
	});
});
