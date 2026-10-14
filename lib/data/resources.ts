import "server-only";
import { prisma } from "@/lib/prisma";

export function getResources() {
  return prisma.resource.findMany({
    orderBy: { name: "asc" },
  });
}