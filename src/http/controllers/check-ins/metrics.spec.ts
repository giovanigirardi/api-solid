import request from "supertest";
import { afterAll, beforeAll, describe, expect, it } from "vitest";

import { app } from "@/app";
import { prisma } from "@/lib/prisma";
import { createAndAuthenticateUser } from "@/utils/test/create-and-authenticate-user";

describe("Check-in metrics", () => {
	beforeAll(async () => {
		await app.ready();
	});

	afterAll(async () => {
		await app.close();
	});

	it("should be able to get the check-ins metrics", async () => {
		const { token } = await createAndAuthenticateUser(app);

		const user = await prisma.user.findFirstOrThrow();

		const createdGym = await prisma.gym.create({
			data: {
				title: "Academia do Zé",
				description: "Academia do Zé, a academia mais top do Brasil",
				phone: "1234567890",
				latitude: 0,
				longitude: 0,
			},
		});

		await prisma.checkIn.createMany({
			data: [
				{
					user_id: user.id,
					gym_id: createdGym.id,
				},
				{
					user_id: user.id,
					gym_id: createdGym.id,
				},
			],
		});

		const response = await request(app.server).get("/check-ins/metrics").set("Authorization", `Bearer ${token}`);

		expect(response.statusCode).toBe(200);
		expect(response.body.checkInsCount).toEqual(2);
	});
});
