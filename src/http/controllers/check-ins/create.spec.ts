import request from "supertest";
import { afterAll, beforeAll, describe, expect, it } from "vitest";

import { app } from "@/app";
import { prisma } from "@/lib/prisma";
import { createAndAuthenticateUser } from "@/utils/test/create-and-authenticate-user";

describe("Create Check-in", () => {
	beforeAll(async () => {
		await app.ready();
	});

	afterAll(async () => {
		await app.close();
	});

	it("should be able to check-in", async () => {
		const { token } = await createAndAuthenticateUser(app);

		const createdGym = await prisma.gym.create({
			data: {
				title: "Academia do Zé",
				description: "Academia do Zé, a academia mais top do Brasil",
				phone: "1234567890",
				latitude: 0,
				longitude: 0,
			},
		});

		const { id } = createdGym;

		const response = await request(app.server)
			.post(`/gyms/${id}/check-in`)
			.set("Authorization", `Bearer ${token}`)
			.send({ latitude: 0, longitude: 0 });

		expect(response.statusCode).toBe(201);
	});
});
