import type { Environment } from "vitest/environments";

export default (<Environment>{
	name: "prisma",
	transformMode: "web",
	async setup() {
		console.log("Setting up Prisma environment");

		return {
			teardown() {
				console.log("Tearing down Prisma environment");
			},
		};
	},
});
