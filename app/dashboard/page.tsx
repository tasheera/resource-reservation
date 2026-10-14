import Link from "next/link";
import { connection } from "next/server";
import { getUpcomingReservations } from "@/lib/data/reservations";
import { formatDateTime } from "@/lib/format";

export const instant = false;

export default async function DashboardPage() {
    await connection();
    const upcoming = await getUpcomingReservations();

    return (
        <div className="mx-auto max-w-5xl p-6">
            <h1 className="mb-6 text-2xl font-bold">Dashboard</h1>

            <section>
                <div className="mb-3 flex items-center justify-between">
                    <h2 className="text-lg font-semibold">Upcoming reservations</h2>
                    <Link href="/reservations" className="text-sm text-blue-600">
                        View all &rarr;
                    </Link>
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
        </div>
    );
}