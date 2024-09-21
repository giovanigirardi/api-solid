import type { FastifyReply, FastifyRequest } from "fastify";

export function verifyUserRole(roleToVerify: "ADMIN" | "MEMBER") {
	console.log("entered middleware");
	return async (request: FastifyRequest, reply: FastifyReply) => {
		const { role } = request.user;
		console.log("user role", role);

		if (role !== roleToVerify) {
			console.log("forbidden");
			return reply.status(403).send({ message: "Forbidden" });
		}
	};
}
