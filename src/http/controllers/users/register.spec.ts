import request from "supertest";
import { afterAll, beforeAll, describe, expect, it } from "vitest";

import { app } from "@/app";

describe("Register", () => {
	beforeAll(async () => {
		await app.ready();
	});

	afterAll(async () => {
		await app.close();
	});

	it("should be able to register a new user", async () => {
		const response = await request(app.server).post("/users").send({
			name: "John Doe",
			email: "johndoe@email.com",
			password: "123456",
		});

		expect(response.statusCode).toBe(201);
	});
});
