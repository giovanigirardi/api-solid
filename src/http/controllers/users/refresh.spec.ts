import request from "supertest";
import { afterAll, beforeAll, describe, expect, it } from "vitest";

import { app } from "@/app";

describe("Refresh", () => {
	beforeAll(async () => {
		await app.ready();
	});

	afterAll(async () => {
		await app.close();
	});

	it("should be able to refresh the token", async () => {
		await request(app.server).post("/users").send({
			name: "John Doe",
			email: "johndoe@email.com",
			password: "123456",
		});

		const authResponse = await request(app.server).post("/sessions").send({
			email: "johndoe@email.com",
			password: "123456",
		});

		const cookie = authResponse.get("set-cookie") ?? "";

		const response = await request(app.server).patch("/token/refresh").set("Cookie", cookie).send();

		expect(authResponse.statusCode).toBe(200);
		expect(authResponse.body).toEqual({
			token: expect.any(String),
		});
		expect(response.get("set-cookie")).toEqual([expect.stringContaining("refreshToken=")]);
	});
});
