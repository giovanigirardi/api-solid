import { Decimal } from "@prisma/client/runtime/library";
import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";

import { InMemoryCheckInsRepository } from "@/repositories/in-memory/in-memory-check-ins-repository";
import { InMemoryGymsRepository } from "@/repositories/in-memory/in-memory-gyms-repository";

import { CheckInUseCase } from "./check-in";

let usersRepository: InMemoryCheckInsRepository;
let gymsRepository: InMemoryGymsRepository;
let sut: CheckInUseCase;

describe("register use case", () => {
	beforeEach(() => {
		usersRepository = new InMemoryCheckInsRepository();
		gymsRepository = new InMemoryGymsRepository();
		sut = new CheckInUseCase(usersRepository, gymsRepository);

		gymsRepository.items.push({
			id: "gym-1",
			title: "Academia 1",
			latitude: new Decimal(0),
			longitude: new Decimal(0),
			description: "Academia 1",
			phone: "123456789",
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
		).rejects.toBeInstanceOf(Error);
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
		).rejects.toBeInstanceOf(Error);
	});
});
