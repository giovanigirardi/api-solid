import { randomUUID } from "node:crypto";
import dayjs from "dayjs";

import type { CheckIn, Prisma } from "@prisma/client";
import type { CheckInsRepository } from "../check-ins-repository";

export class InMemoryCheckInsRepository implements CheckInsRepository {
	public items: CheckIn[] = [];

	async create(data: Prisma.CheckInUncheckedCreateInput) {
		const checkIn = {
			id: randomUUID(),
			user_id: data.user_id,
			gym_id: data.gym_id,
			validated_at: data.validated_at ? new Date(data.validated_at) : null,
			created_at: new Date(),
		};

		this.items.push(checkIn);

		return checkIn;
	}

	async findByUserIdOnDate(userId: string, date: Date) {
		const startOfDay = dayjs(date).startOf("date");
		const endOfDay = dayjs(date).endOf("date");

		const checkInOnSameDay = this.items.find((checkIn) => {
			const checkInDate = dayjs(checkIn.created_at);
			const isOnSameDay = checkInDate.isAfter(startOfDay) && checkInDate.isBefore(endOfDay);
			const isSameUser = checkIn.user_id === userId;

			return isSameUser && isOnSameDay;
		});

		if (!checkInOnSameDay) {
			return null;
		}

		return checkInOnSameDay;
	}
}
