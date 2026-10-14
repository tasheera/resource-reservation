"use server";

import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { prisma } from "@/lib/prisma";
import { parseLocalDateTime } from "@/lib/format";
import { reservationSchema } from "@/lib/validations";

export type ReservationFormState =
  | {
      errors?: Record<string, string[] | undefined>;
      values?: Record<string, string>;
    }
  | undefined;

export async function createReservation(
  _prev: ReservationFormState,
  formData: FormData
): Promise<ReservationFormState> {
  const raw = Object.fromEntries(formData);
  const parsed = reservationSchema.safeParse(raw);

  if (!parsed.success) {
    return {
      errors: parsed.error.flatten().fieldErrors,
      values: raw as Record<string, string>,
    };
  }

  const { resourceId, bookedByName, bookedByEmail, purpose, startTime, endTime } =
    parsed.data;

  await prisma.reservation.create({
    data: {
      resourceId,
      bookedByName,
      bookedByEmail,
      purpose,
      startTime: parseLocalDateTime(startTime),
      endTime: parseLocalDateTime(endTime),
    },
  });

  revalidatePath("/reservations");
  redirect("/reservations");
}