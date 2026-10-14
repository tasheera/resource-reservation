import { z } from "zod";

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