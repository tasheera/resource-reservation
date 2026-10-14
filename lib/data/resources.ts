import "server-only";
import { prisma } from "@/lib/prisma";

export function getResources() {
  return prisma.resource.findMany({
    orderBy: { name: "asc" },
  });
}

export function getResourceById(id: number) {
  return prisma.resource.findUnique({ where: { id } });
}