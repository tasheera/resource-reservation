"use server";

import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { prisma } from "@/lib/prisma";
import { resourceSchema } from "@/lib/lib/validations";

export type FormState =
  | { errors?: Record<string, string[] | undefined> }
  | undefined;

export async function createResource(
  _prev: FormState,
  formData: FormData
): Promise<FormState> {
  const parsed = resourceSchema.safeParse(Object.fromEntries(formData));

  if (!parsed.success) {
    return { errors: parsed.error.flatten().fieldErrors };
  }

  const { name, type, location, capacity, description } = parsed.data;

  await prisma.resource.create({
    data: {
      name,
      type,
      capacity: capacity ?? null,
      location: location || null,
      description: description || null,
    },
  });

  revalidatePath("/resources");
  redirect("/resources");
}