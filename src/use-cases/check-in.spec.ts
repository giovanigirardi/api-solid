import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";

import { InMemoryCheckInsRepository } from "@/repositories/in-memory/in-memory-check-ins-repository";
import { InMemoryGymsRepository } from "@/repositories/in-memory/in-memory-gyms-repository";

import { CheckInUseCase } from "./check-in";
import { MaxDistanceError } from "./errors/max-distance";
import { MaxNumberOfCheckInsError } from "./errors/max-number-of-check-ins";

let usersRepository: InMemoryCheckInsRepository;
let gymsRepository: InMemoryGymsRepository;
let sut: CheckInUseCase;

describe("Check in use case", () => {
	beforeEach(async () => {
		usersRepository = new InMemoryCheckInsRepository();
		gymsRepository = new InMemoryGymsRepository();
		sut = new CheckInUseCase(usersRepository, gymsRepository);

		await gymsRepository.create({
			id: "gym-1",
			title: "Academia 1",
			description: null,
			phone: null,
			latitude: 0,
			longitude: 0,
		});

		vi.useFakeTimers();
	});

	afterEach(() => {
		vi.useRealTimers();
	});

	it("should register a new check in", async () => {
		const { checkIn } = await sut.execute({
			userId: "user-1",
			gymId: "gym-1",
			userLatitude: 0,
			userLongitude: 0,
		});

		expect(checkIn.id).toEqual(expect.any(String));
	});

	it("should not be able to check in twice on te same day", async () => {
		vi.setSystemTime(new Date(2022, 0, 1, 10, 0, 0));

		await sut.execute({
			userId: "user-1",
			gymId: "gym-1",
			userLatitude: 0,
			userLongitude: 0,
		});

		await expect(
			sut.execute({
				userId: "user-1",
				gymId: "gym-1",
				userLatitude: 0,
				userLongitude: 0,
			}),
		).rejects.toBeInstanceOf(MaxNumberOfCheckInsError);
	});

	it("should be able to check in twice in different days", async () => {
		vi.setSystemTime(new Date(2022, 0, 1, 10, 0, 0));

		await sut.execute({
			userId: "user-1",
			gymId: "gym-1",
			userLatitude: 0,
			userLongitude: 0,
		});

		vi.setSystemTime(new Date(2022, 1, 1, 10, 0, 0));

		const { checkIn } = await sut.execute({
			userId: "user-1",
			gymId: "gym-1",
			userLatitude: 0,
			userLongitude: 0,
		});

		expect(checkIn.id).toEqual(expect.any(String));
	});

	it("should not be able to check in on distant gym", async () => {
		await expect(
			sut.execute({
				userId: "user-1",
				gymId: "gym-1",
				userLatitude: 10,
				userLongitude: 10,
			}),
		).rejects.toBeInstanceOf(MaxDistanceError);
	});
});
