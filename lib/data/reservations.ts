import "server-only";
import { prisma } from "@/lib/prisma";

export function getReservations() {
  return prisma.reservation.findMany({
    include: { resource: { select: { name: true } } },
    orderBy: { startTime: "desc" },
  });
}

export function getConfirmedReservationsForDay(
  resourceId: number,
  dayStart: Date,
  dayEnd: Date
) {
  return prisma.reservation.findMany({
    where: {
      resourceId,
      status: "CONFIRMED",
      startTime: { lt: dayEnd },
      endTime: { gt: dayStart },
    },
    orderBy: { startTime: "asc" },
    select: {
      id: true,
      bookedByName: true,
      purpose: true,
      startTime: true,
      endTime: true,
    },
  });
}

export function getUpcomingReservations(limit = 10) {
  return prisma.reservation.findMany({
    where: {
      status: "CONFIRMED",
      endTime: { gt: new Date() },
    },
    orderBy: { startTime: "asc" },
    take: limit,
    include: { resource: { select: { name: true } } },
  });
}