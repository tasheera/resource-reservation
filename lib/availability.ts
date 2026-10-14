type Timed = { startTime: Date; endTime: Date };

export type Segment<T extends Timed> =
  | { kind: "free"; start: Date; end: Date }
  | { kind: "booked"; start: Date; end: Date; reservation: T };

export function buildDaySegments<T extends Timed>(
  dayStart: Date,
  dayEnd: Date,
  reservations: T[]
): Segment<T>[] {
  const segments: Segment<T>[] = [];
  let cursor = dayStart;

  for (const r of reservations) {
    const start = r.startTime > dayStart ? r.startTime : dayStart;
    const end = r.endTime < dayEnd ? r.endTime : dayEnd;

    if (start > cursor) segments.push({ kind: "free", start: cursor, end: start });
    segments.push({ kind: "booked", start, end, reservation: r });
    cursor = end;
  }

  if (cursor < dayEnd) segments.push({ kind: "free", start: cursor, end: dayEnd });
  return segments;
}