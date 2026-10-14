"use server";

import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { prisma } from "@/lib/prisma";
import { resourceSchema } from "@/lib/validations";

export type FormState =
  | {
    errors?: Record<string, string[] | undefined>;
    values?: Record<string, string>;
  }
  | undefined;

function parseResource(formData: FormData) {
  const raw = Object.fromEntries(formData);
  const parsed = resourceSchema.safeParse(raw);

  if (!parsed.success) {
    return {
      ok: false as const,
      state: {
        errors: parsed.error.flatten().fieldErrors,
        values: raw as Record<string, string>,
      },
    };
  }

  const { name, type, location, capacity, description } = parsed.data;
  return {
    ok: true as const,
    data: {
      name,
      type,
      capacity: capacity ?? null,
      location: location || null,
      description: description || null,
    },
  };
}

export async function createResource(
  _prev: FormState,
  formData: FormData
): Promise<FormState> {
  const result = parseResource(formData);
  if (!result.ok) return result.state;

  await prisma.resource.create({ data: result.data });

  revalidatePath("/resources");
  redirect("/resources");
}

export async function updateResource(
  id: number,
  _prev: FormState,
  formData: FormData
): Promise<FormState> {
  const result = parseResource(formData);
  if (!result.ok) return result.state;

  await prisma.resource.update({ where: { id }, data: result.data });

  revalidatePath("/resources");
  redirect("/resources");
}

export async function setResourceActive(id: number, isActive: boolean) {
  await prisma.resource.updateMany({
    where: { id },
    data: { isActive },
  });

  revalidatePath("/resources");
}