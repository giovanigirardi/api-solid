import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";

import { InMemoryCheckInsRepository } from "@/repositories/in-memory/in-memory-check-ins-repository";

import { LateCheckInError } from "./errors/late-check-in";
import { ResourceNotFound } from "./errors/resource-not-found";
import { ValidateCheckInUseCase } from "./validate-check-in";

let checkInsRepository: InMemoryCheckInsRepository;
let sut: ValidateCheckInUseCase;

describe("Validate check in use case", () => {
	beforeEach(async () => {
		checkInsRepository = new InMemoryCheckInsRepository();
		sut = new ValidateCheckInUseCase(checkInsRepository);

		vi.useFakeTimers();
	});

	afterEach(() => {
		vi.useRealTimers();
	});

	it("should be able to validate check in", async () => {
		const createdCheckIn = await checkInsRepository.create({
			gym_id: "gym-1",
			user_id: "user-1",
		});

		const { checkIn } = await sut.execute({
			checkInId: createdCheckIn.id,
		});

		expect(checkIn.validated_at).toEqual(expect.any(Date));
		expect(checkInsRepository.items[0].validated_at).toEqual(expect.any(Date));
	});

	it("should not be able to validate an inexistent check in", async () => {
		await expect(async () => await sut.execute({ checkInId: "Inexistent check in id" })).rejects.toBeInstanceOf(
			ResourceNotFound,
		);
	});

	it("should not be able to validate the check in after 20 minutes of creation", async () => {
		vi.setSystemTime(new Date(2023, 0, 1, 13, 40, 0));

		const createdCheckIn = await checkInsRepository.create({
			gym_id: "gym-1",
			user_id: "user-1",
		});

		vi.advanceTimersByTime(1000 * 60 * 21); // 21 minutes

		await expect(
			async () =>
				await sut.execute({
					checkInId: createdCheckIn.id,
				}),
		).rejects.toBeInstanceOf(LateCheckInError);
	});
});
