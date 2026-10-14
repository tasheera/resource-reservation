import "server-only";
import { prisma } from "@/lib/prisma";

type ResourceFilters = {
  q?: string;
  type?: string;
};

export function getResources({ q, type }: ResourceFilters = {}) {
  return prisma.resource.findMany({
    where: {
      ...(q ? { name: { contains: q, mode: "insensitive" } } : {}),
      ...(type ? { type } : {}),
    },
    orderBy: { name: "asc" },
  });
}

export function getResourceById(id: number) {
  return prisma.resource.findUnique({ where: { id } });
}

export function getActiveResources() {
  return prisma.resource.findMany({
    where: { isActive: true },
    orderBy: { name: "asc" },
    select: { id: true, name: true },
  });
}

export async function getResourceUsage() {
  const resources = await prisma.resource.findMany({
    select: {
      id: true,
      name: true,
      isActive: true,
      _count: {
        select: { reservations: { where: { status: "CONFIRMED" } } },
      },
    },
  });

  return resources
    .map((r) => ({
      id: r.id,
      name: r.name,
      isActive: r.isActive,
      bookings: r._count.reservations,
    }))
    .sort((a, b) => b.bookings - a.bookings || a.name.localeCompare(b.name));
}