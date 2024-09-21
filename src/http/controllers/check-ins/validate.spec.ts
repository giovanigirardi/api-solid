import request from "supertest";
import { afterAll, beforeAll, describe, expect, it } from "vitest";

import { app } from "@/app";
import { prisma } from "@/lib/prisma";
import { createAndAuthenticateUser } from "@/utils/test/create-and-authenticate-user";

describe("Validate Check-in", () => {
	beforeAll(async () => {
		await app.ready();
	});

	afterAll(async () => {
		await app.close();
	});

	it("should be able to validate check-in", async () => {
		const { token } = await createAndAuthenticateUser(app, true);

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

		let checkIn = await prisma.checkIn.create({
			data: {
				user_id: user.id,
				gym_id: createdGym.id,
			},
		});

		const response = await request(app.server)
			.patch(`/check-ins/${checkIn.id}/validate`)
			.set("Authorization", `Bearer ${token}`);

		expect(response.statusCode).toBe(204);

		checkIn = await prisma.checkIn.findUniqueOrThrow({
			where: {
				id: checkIn.id,
			},
		});

		expect(checkIn.validated_at).toEqual(expect.any(Date));
	});
});
