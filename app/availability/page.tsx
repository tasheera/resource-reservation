import Link from "next/link";
import { getActiveResources } from "@/lib/data/resources";
import { getConfirmedReservationsForDay } from "@/lib/data/reservations";
import { buildDaySegments } from "@/lib/availability";
import {
    formatTime,
    parseLocalDateTime,
    shiftDate,
    todayInAppTimezone,
} from "@/lib/format";

const DATE_PATTERN = /^\d{4}-\d{2}-\d{2}$/;


export const instant = false;

export default async function AvailabilityPage({
    searchParams,
}: {
    searchParams: Promise<{ resourceId?: string; date?: string }>;
}) {
    const { resourceId, date: dateParam } = await searchParams;

    const resources = await getActiveResources();
    if (resources.length === 0) {
        return (
            <div className="mx-auto max-w-5xl p-6">
                <h1 className="mb-4 text-2xl font-bold">Availability</h1>
                <p className="text-gray-500">There are no active resources yet.</p>
            </div>
        );
    }

    const selected =
        resources.find((r) => r.id === Number(resourceId)) ?? resources[0];

    const isValidDate =
        !!dateParam &&
        DATE_PATTERN.test(dateParam) &&
        !Number.isNaN(parseLocalDateTime(`${dateParam}T00:00`).getTime());
    const date = isValidDate ? dateParam : todayInAppTimezone();

    const dayStart = parseLocalDateTime(`${date}T00:00`);
    const dayEnd = new Date(dayStart.getTime() + 24 * 60 * 60 * 1000);

    const reservations = await getConfirmedReservationsForDay(
        selected.id,
        dayStart,
        dayEnd
    );
    const segments = buildDaySegments(dayStart, dayEnd, reservations);

    const label = (d: Date) =>
        d.getTime() === dayEnd.getTime() ? "24:00" : formatTime(d);

    const dayLink = (days: number) =>
        `/availability?resourceId=${selected.id}&date=${shiftDate(date, days)}`;

    return (
        <div className="mx-auto max-w-5xl p-6">
            <h1 className="mb-4 text-2xl font-bold">Availability</h1>

            <form action="/availability" method="get" className="mb-4 flex gap-2">
                <select
                    name="resourceId"
                    defaultValue={selected.id}
                    className="rounded border border-gray-300 px-3 py-2"
                >
                    {resources.map((r) => (
                        <option key={r.id} value={r.id}>{r.name}</option>
                    ))}
                </select>
                <input
                    type="date"
                    name="date"
                    defaultValue={date}
                    className="rounded border border-gray-300 px-3 py-2"
                />
                <button type="submit" className="rounded border px-4 py-2">
                    Show
                </button>
            </form>

            <div className="mb-4 flex max-w-lg items-center justify-between">
                <Link href={dayLink(-1)} className="text-blue-600">&larr; Previous day</Link>
                <span className="font-medium">{selected.name} &middot; {date}</span>
                <Link href={dayLink(1)} className="text-blue-600">Next day &rarr;</Link>
            </div>

            <ul className="max-w-lg space-y-2">
                {segments.map((s, i) => (
                    <li
                        key={i}
                        className={`flex items-center justify-between rounded border px-4 py-3 ${s.kind === "booked"
                                ? "border-red-200 bg-red-50"
                                : "border-green-200 bg-green-50"
                            }`}
                    >
                        <span className="font-medium">
                            {label(s.start)} &ndash; {label(s.end)}
                        </span>
                        {s.kind === "booked" ? (
                            <span className="text-sm text-red-700">
                                {s.reservation.bookedByName}: {s.reservation.purpose}
                            </span>
                        ) : (
                            <span className="text-sm text-green-700">Free</span>
                        )}
                    </li>
                ))}
            </ul>
        </div>
    );
}