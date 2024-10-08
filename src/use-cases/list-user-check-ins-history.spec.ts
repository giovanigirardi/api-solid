import { beforeEach, describe, expect, it } from "vitest";

import { InMemoryCheckInsRepository } from "@/repositories/in-memory/in-memory-check-ins-repository";
import { ListUserCheckInsHistoryUseCase } from "./list-user-check-ins-history";

let checkInsRepository: InMemoryCheckInsRepository;
let sut: ListUserCheckInsHistoryUseCase;

describe("List user check ins history use case", () => {
	beforeEach(async () => {
		checkInsRepository = new InMemoryCheckInsRepository();
		sut = new ListUserCheckInsHistoryUseCase(checkInsRepository);
	});

	it("should be able to list check in history", async () => {
		await checkInsRepository.create({
			gym_id: "gym-1",
			user_id: "user-1",
		});

		await checkInsRepository.create({
			gym_id: "gym-2",
			user_id: "user-1",
		});

		const { checkIns } = await sut.execute({
			userId: "user-1",
			page: 1,
		});

		expect(checkIns).toHaveLength(2);
		expect(checkIns).toEqual([
			expect.objectContaining({ gym_id: "gym-1" }),
			expect.objectContaining({ gym_id: "gym-2" }),
		]);
	});

	it("should be able to paginate the list of user check in history", async () => {
		for (let i = 0; i < 22; i++) {
			await checkInsRepository.create({
				gym_id: `gym-${i + 1}`,
				user_id: "user-1",
			});
		}

		const { checkIns } = await sut.execute({
			userId: "user-1",
			page: 2,
		});

		expect(checkIns).toHaveLength(2);
		expect(checkIns).toEqual([
			expect.objectContaining({ gym_id: "gym-21" }),
			expect.objectContaining({ gym_id: "gym-22" }),
		]);
	});
});
