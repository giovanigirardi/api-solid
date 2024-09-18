import request from "supertest";
import { afterAll, beforeAll, describe, expect, it } from "vitest";

import { app } from "@/app";
import { createAndAuthenticateUser } from "@/utils/test/create-and-authenticate-user";

describe("Nearby Gyms", () => {
	beforeAll(async () => {
		await app.ready();
	});

	afterAll(async () => {
		await app.close();
	});

	it("should be able to list nearby gyms", async () => {
		const { token } = await createAndAuthenticateUser(app);

		await request(app.server).post("/gyms").set("Authorization", `Bearer ${token}`).send({
			title: "Academia do Zé",
			description: "Academia do Zé, a academia mais top do Brasil",
			phone: "1234567890",
			latitude: 0,
			longitude: 0,
		});

		await request(app.server).post("/gyms").set("Authorization", `Bearer ${token}`).send({
			title: "Academia do João",
			description: "Academia do João, a academia verdadeiramente mais top do Brasil",
			phone: "1234567890",
			latitude: 10,
			longitude: 10,
		});

		const response = await request(app.server)
			.get("/gyms/nearby")
			.query({ latitude: 0, longitude: 0 })
			.set("Authorization", `Bearer ${token}`);

		expect(response.statusCode).toBe(200);
		expect(response.body.gyms).toHaveLength(1);
		expect(response.body.gyms).toEqual([expect.objectContaining({ title: "Academia do Zé" })]);
	});
});
