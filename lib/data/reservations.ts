import "server-only";
import { prisma } from "@/lib/prisma";

export function getReservations() {
  return prisma.reservation.findMany({
    include: { resource: { select: { name: true } } },
    orderBy: { startTime: "desc" },
  });
}