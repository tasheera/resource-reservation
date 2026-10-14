import Link from "next/link";
import { connection } from "next/server";
import { getUpcomingReservations } from "@/lib/data/reservations";
import { formatDateTime } from "@/lib/format";
import { getResourceUsage } from "@/lib/data/resources";

export const instant = false;

export default async function DashboardPage() {
    await connection();
    const [upcoming, usage] = await Promise.all([
        getUpcomingReservations(),
        getResourceUsage(),
    ]);
    const maxBookings = Math.max(1, ...usage.map((u) => u.bookings));
    return (
        <div className="mx-auto max-w-5xl p-6">
            <h1 className="mb-6 text-2xl font-bold">Dashboard</h1>

            <section>
                <div className="mb-3 flex items-center justify-between">
                    <h2 className="text-lg font-semibold">Upcoming reservations</h2>
                </div>

                {upcoming.length === 0 ? (
                    <p className="text-gray-500">
                        Nothing coming up.{" "}
                        <Link href="/reservations/new" className="text-blue-600 underline">
                            Make a reservation
                        </Link>
                    </p>
                ) : (
                    <table className="w-full text-left text-sm">
                        <thead className="border-b font-medium">
                            <tr>
                                <th className="py-2">Resource</th>
                                <th>Start</th>
                                <th>End</th>
                                <th>Booked by</th>
                                <th>Purpose</th>
                            </tr>
                        </thead>
                        <tbody>
                            {upcoming.map((b) => (
                                <tr key={b.id} className="border-b">
                                    <td className="py-2 font-medium">{b.resource.name}</td>
                                    <td>{formatDateTime(b.startTime)}</td>
                                    <td>{formatDateTime(b.endTime)}</td>
                                    <td>{b.bookedByName}</td>
                                    <td>{b.purpose}</td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                )}
            </section>

            <section className="mt-10">
                <h2 className="mb-3 text-lg font-semibold">Bookings per resource</h2>

                {usage.length === 0 ? (
                    <p className="text-gray-500">No resources yet.</p>
                ) : (
                    <ul className="max-w-lg space-y-3">
                        {usage.map((u) => (
                            <li key={u.id}>
                                <div className="flex justify-between text-sm">
                                    <span className={u.isActive ? "font-medium" : "text-gray-400"}>
                                        {u.name}
                                        {!u.isActive && " (inactive)"}
                                    </span>
                                    <span>{u.bookings}</span>
                                </div>
                                <div className="mt-1 h-2 rounded bg-gray-100">
                                    <div
                                        className="h-2 rounded bg-green-600"
                                        style={{ width: `${(u.bookings / maxBookings) * 100}%` }}
                                    />
                                </div>
                            </li>
                        ))}
                    </ul>
                )}
            </section>
        </div>
    );
}