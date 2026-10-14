import Link from "next/link";
import { getReservations, PAGE_SIZE } from "@/lib/data/reservations";
import { getResources } from "@/lib/data/resources";
import { formatDateTime } from "@/lib/format";
import { cancelReservation } from "./actions";

const STATUSES = ["CONFIRMED", "CANCELLED"] as const;

export const instant = false;

export default async function ReservationsPage({
  searchParams,
}: {
  searchParams: Promise<{ resourceId?: string; status?: string; page?: string }>;
}) {
  const params = await searchParams;
  const resources = await getResources();

  const resourceId = resources.find((r) => r.id === Number(params.resourceId))?.id;
  const status = STATUSES.find((s) => s === params.status);
  const requestedPage = Number.parseInt(params.page ?? "1", 10);

  const { items, total, totalPages, currentPage } = await getReservations({
    resourceId,
    status,
    page: Number.isNaN(requestedPage) ? 1 : requestedPage,
  });

  const filtersActive = Boolean(resourceId || status);

  const pageHref = (p: number) => {
    const query = new URLSearchParams();
    if (resourceId) query.set("resourceId", String(resourceId));
    if (status) query.set("status", status);
    if (p > 1) query.set("page", String(p));
    const qs = query.toString();
    return qs ? `/reservations?${qs}` : "/reservations";
  };

  const from = (currentPage - 1) * PAGE_SIZE + 1;
  const to = from + items.length - 1;

  return (
    <main className="min-h-screen px-6 py-10 lg:px-10">
      <div className="mx-auto max-w-5xl">
        <div className="mb-4 flex items-center justify-between">
          <h1 className="text-2xl font-bold">Reservations</h1>
        </div>

        <form
          key={`${resourceId ?? ""}-${status ?? ""}`}
          action="/reservations"
          method="get"
          className="mb-4 flex flex-wrap gap-2"
        >
          <select
            name="resourceId"
            defaultValue={resourceId ?? ""}
            className="rounded border border-gray-300 px-3 py-2"
          >
            <option value="">All resources</option>
            {resources.map((r) => (
              <option key={r.id} value={r.id}>{r.name}</option>
            ))}
          </select>
          <select
            name="status"
            defaultValue={status ?? ""}
            className="rounded border border-gray-300 px-3 py-2"
          >
            <option value="">All statuses</option>
            <option value="CONFIRMED">Confirmed</option>
            <option value="CANCELLED">Cancelled</option>
          </select>
          <button type="submit" className="rounded border px-4 py-2">
            Filter
          </button>
          {filtersActive && (
            <Link href="/reservations" className="px-2 py-2 text-gray-600 underline">
              Clear
            </Link>
          )}
        </form>

        {items.length === 0 ? (
          <p className="border border-dashed border-gray-300 px-5 py-8 text-gray-500">
            {filtersActive ? "No reservations match your filters." : "No reservations yet."}
          </p>
        ) : (
          <>
            <div className="overflow-x-auto border border-gray-200 bg-white">
              <table className="w-full min-w-225 text-left text-sm">
                <thead className="border-b border-gray-200 bg-gray-100 font-mono text-xs uppercase tracking-wider text-gray-500">
                  <tr>
                    <th className="px-5 py-4">Resource</th>
                    <th>Booked by</th>
                    <th>Purpose</th>
                    <th>Start</th>
                    <th>End</th>
                    <th>Status</th>
                    <th></th>
                  </tr>
                </thead>
                <tbody>
                  {items.map((b) => (
                    <tr
                      key={b.id}
                      className={`border-b border-gray-200 last:border-0 hover:bg-gray-50 ${b.status === "CANCELLED" ? "text-gray-400" : ""
                        }`}
                    >
                      <td className="px-5 py-4 font-medium">{b.resource.name}</td>
                      <td className="py-4">
                        {b.bookedByName}
                        <div className="text-xs text-gray-500">{b.bookedByEmail}</div>
                      </td>
                      <td className="py-4">{b.purpose}</td>
                      <td className="py-4">{formatDateTime(b.startTime)}</td>
                      <td className="py-4">{formatDateTime(b.endTime)}</td>
                      <td className="py-4">
                        {b.status === "CONFIRMED" ? "Confirmed" : "Cancelled"}
                      </td>
                      <td className="py-4">
                        {b.status === "CONFIRMED" && (
                          <form action={cancelReservation.bind(null, b.id)}>
                            <button type="submit" className="text-gray-600 underline">
                              Cancel
                            </button>
                          </form>
                        )}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            <div className="mt-4 flex items-center justify-between text-sm">
              <span className="text-gray-600">
                Showing {from}&ndash;{to} of {total}
              </span>
              <div className="flex items-center gap-4">
                {currentPage > 1 ? (
                  <Link href={pageHref(currentPage - 1)} className="text-blue-600">
                    &larr; Previous
                  </Link>
                ) : (
                  <span className="text-gray-300">&larr; Previous</span>
                )}
                <span>Page {currentPage} of {totalPages}</span>
                {currentPage < totalPages ? (
                  <Link href={pageHref(currentPage + 1)} className="text-blue-600">
                    Next &rarr;
                  </Link>
                ) : (
                  <span className="text-gray-300">Next &rarr;</span>
                )}
              </div>
            </div>
          </>
        )}
      </div>
    </main>
  );
}