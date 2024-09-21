import { hash } from "bcryptjs";
import request from "supertest";

import { prisma } from "@/lib/prisma";
import type { FastifyInstance } from "fastify";

export async function createAndAuthenticateUser(app: FastifyInstance, isAdmin = false) {
	await prisma.user.create({
		data: {
			name: "John Doe",
			email: "johndoe@example.com",
			password_hash: await hash("123456", 10),
			role: isAdmin ? "ADMIN" : "MEMBER",
		},
	});

	const authResponse = await request(app.server).post("/sessions").send({
		email: "johndoe@example.com",
		password: "123456",
	});

	const { token } = authResponse.body;

	return { token };
}
