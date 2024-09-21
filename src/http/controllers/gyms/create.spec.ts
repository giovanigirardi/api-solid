import request from "supertest";
import { afterAll, beforeAll, describe, expect, it } from "vitest";

import { app } from "@/app";
import { createAndAuthenticateUser } from "@/utils/test/create-and-authenticate-user";

describe("Create Gyms", () => {
	beforeAll(async () => {
		await app.ready();
	});

	afterAll(async () => {
		await app.close();
	});

	it("should be able to create a gym", async () => {
		const { token } = await createAndAuthenticateUser(app, true);

		const response = await request(app.server).post("/gyms").set("Authorization", `Bearer ${token}`).send({
			title: "Academia do Zé",
			description: "Academia do Zé, a academia mais top do Brasil",
			phone: "1234567890",
			latitude: 0,
			longitude: 0,
		});

		expect(response.statusCode).toBe(201);
	});
});
