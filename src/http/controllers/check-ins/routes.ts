import type { FastifyInstance } from "fastify";

import { verifyUserRole } from "@/http/middlewares/verify-user-role";

import { verifyJwt } from "../../middlewares/verify-jwt";
import { create } from "./create";
import { history } from "./history";
import { metrics } from "./metrics";
import { validate } from "./validate";

export async function checkInsRoutes(app: FastifyInstance) {
	app.addHook("onRequest", verifyJwt);

	app.get("/check-ins/history", history);
	app.get("/check-ins/metrics", metrics);

	app.post("/gyms/:gymId/check-in", create);

	app.patch("/check-ins/:checkInId/validate", { onRequest: [verifyUserRole("ADMIN")] }, validate);
}
