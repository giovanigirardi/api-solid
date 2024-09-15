export class LateCheckInError extends Error {
	constructor() {
		super("Check-in is too old to be validated");
	}
}
