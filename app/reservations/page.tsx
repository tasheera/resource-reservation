import { getReservations } from "@/lib/data/reservations";
import { formatDateTime } from "@/lib/format";
import Link from "next/link";
import { cancelReservation } from "./actions";

export const instant = false;


export default async function ReservationsPage() {
  const reservations = await getReservations();

  return (
    <div className="mx-auto max-w-5xl p-6">
      <div className="mb-4 flex items-center justify-between">
        <h1 className="text-2xl font-bold">Reservations</h1>
        <Link href="/reservations/new" className="rounded bg-green-600 px-4 py-2 text-white">
          + New reservation
        </Link>
      </div>
      {reservations.length === 0 ? (
        <p className="text-gray-500">No reservations yet.</p>
      ) : (
        <table className="w-full text-left text-sm">
          <thead className="border-b font-medium">
            <tr>
              <th className="py-2">Resource</th>
              <th>Booked by</th>
              <th>Purpose</th>
              <th>Start</th>
              <th>End</th>
              <th>Status</th>
              <th></th>
            </tr>
          </thead>
          <tbody>
            {reservations.map((b) => (
              <tr
                key={b.id}
                className={`border-b ${b.status === "CANCELLED" ? "text-gray-400" : ""}`}
              >
                <td className="py-2 font-medium">{b.resource.name}</td>
                <td>
                  {b.bookedByName}
                  <div className="text-xs text-gray-500">{b.bookedByEmail}</div>
                </td>
                <td>{b.purpose}</td>
                <td>{formatDateTime(b.startTime)}</td>
                <td>{formatDateTime(b.endTime)}</td>
                <td>{b.status === "CONFIRMED" ? "Confirmed" : "Cancelled"}</td>
                <td>
                  {b.status === "CONFIRMED" && (
                    <form action={cancelReservation.bind(null, b.id)}>
                      <button type="submit" className="text-red-600 underline">
                        Cancel
                      </button>
                    </form>
                  )}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      )}
    </div>
  );
}