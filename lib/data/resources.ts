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