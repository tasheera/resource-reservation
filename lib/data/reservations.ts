import "server-only";
import { prisma } from "@/lib/prisma";
import type { ReservationStatus } from "@prisma/client";

export const PAGE_SIZE = 10;

type ReservationFilters = {
  resourceId?: number;
  status?: ReservationStatus;
  page?: number;
};

export async function getReservations({
  resourceId,
  status,
  page = 1,
}: ReservationFilters = {}) {
  const where = {
    ...(resourceId ? { resourceId } : {}),
    ...(status ? { status } : {}),
  };

  const total = await prisma.reservation.count({ where });
  const totalPages = Math.max(1, Math.ceil(total / PAGE_SIZE));
  const currentPage = Math.min(Math.max(1, page), totalPages);

  const items = await prisma.reservation.findMany({
    where,
    include: { resource: { select: { name: true } } },
    orderBy: [{ startTime: "desc" }, { id: "desc" }],
    skip: (currentPage - 1) * PAGE_SIZE,
    take: PAGE_SIZE,
  });

  return { items, total, totalPages, currentPage };
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