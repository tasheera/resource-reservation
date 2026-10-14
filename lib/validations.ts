import { z } from "zod";
import { parseLocalDateTime } from "@/lib/format";

export const RESOURCE_TYPES = ["ROOM", "EQUIPMENT", "VEHICLE", "OTHER"] as const;

export const resourceSchema = z.object({
  name: z.string().trim().min(1, "Name is required").max(100),
  type: z.enum(RESOURCE_TYPES, { message: "Pick a valid type" }),
  location: z.string().trim().max(100).optional(),
  capacity: z.preprocess(
    (v) => (v === "" ? undefined : v),
    z.coerce.number().int("Must be a whole number").positive("Must be greater than 0").optional()
  ),
  description: z.string().trim().max(500).optional(),
});


const validDateTime = (v: string) => !Number.isNaN(parseLocalDateTime(v).getTime());

export const reservationSchema = z.object({
  resourceId: z.coerce.number().int().positive("Pick a resource"),
  bookedByName: z.string().trim().min(1, "Name is required").max(100),
  bookedByEmail: z.string().trim().email("Enter a valid email").max(200),
  purpose: z.string().trim().min(1, "Purpose is required").max(300),
  startTime: z.string().min(1, "Start time is required").refine(validDateTime, "Invalid date"),
  endTime: z.string().min(1, "End time is required").refine(validDateTime, "Invalid date"),
});