import { getResources } from "@/lib/data/resources";
import { RESOURCE_TYPES } from "@/lib/validations";
import Link from "next/link";
import { setResourceActive } from "./actions";

export const instant = false;

export default async function ResourcesPage({
  searchParams,
}: {
  searchParams: Promise<{ q?: string; type?: string }>;
}) {
  const { q, type } = await searchParams;

  const validType = RESOURCE_TYPES.find((t) => t === type);

  const resources = await getResources({ q: q?.trim(), type: validType });

  return (
    <main className="min-h-screen px-6 py-10 lg:px-10">
      <div className="mx-auto max-w-5xl">
        <p className="mb-3 font-mono text-xs tracking-[0.2em] text-yellow-300">RESERVE / 01</p>
        <div className="mb-4 flex items-center justify-between">
          <h1 className="text-2xl font-bold">Resources</h1>
          <Link href="/resources/new" className="rounded bg-green-600 px-4 py-2 text-white">
            + Add resource
          </Link>
        </div>
        <form action="/resources" method="get" className="mb-4 flex gap-2">
          <input
            name="q"
            defaultValue={q}
            placeholder="Search by name..."
            className="rounded border border-gray-300 px-3 py-2"
          />
          <select
            key={validType ?? ""}
            name="type"
            defaultValue={validType ?? ""}
            className="rounded border border-gray-300 px-3 py-2"
          >
            <option value="">All types</option>
            {RESOURCE_TYPES.map((t) => (
              <option key={t} value={t}>{t}</option>
            ))}
          </select>
          <button type="submit" className="rounded border px-4 py-2">
            Filter
          </button>
          {(q || validType) && (
            <Link href="/resources" className="px-2 py-2 text-gray-600 underline">
              Clear
            </Link>
          )}
        </form>
        {resources.length === 0 ? (
          <p className="border border-dashed border-gray-300 px-5 py-8 text-gray-500">No resources yet.</p>
        ) : (
          <div className="overflow-x-auto border border-gray-200 bg-white">
            <table className="w-full min-w-[640px] text-left text-sm">
              <thead className="border-b border-gray-200 bg-gray-100 font-mono text-xs uppercase tracking-wider text-gray-500">
                <tr>
                  <th className="px-5 py-4">Name</th>
                  <th>Type</th>
                  <th>Location</th>
                  <th>Capacity</th>
                  <th>Status</th>
                  <th></th>
                </tr>
              </thead>
              <tbody>
                {resources.map((r) => (
                  <tr key={r.id} className="border-b border-gray-200 last:border-0 hover:bg-gray-50">
                    <td className="px-5 py-4 font-medium">{r.name}</td>
                    <td>{r.type}</td>
                    <td>{r.location ?? "-"}</td>
                    <td>{r.capacity ?? "-"}</td>
                    <td>
                      <span className={r.isActive ? "text-green-700" : "text-gray-400"}>
                        {r.isActive ? "Active" : "Inactive"}
                      </span>
                    </td>
                    <td className="flex gap-3 py-2">
                      <Link href={`/resources/${r.id}/edit`} className="text-blue-600">
                        Edit
                      </Link>
                      <form action={setResourceActive.bind(null, r.id, !r.isActive)}>
                        <button type="submit" className="text-gray-600 underline">
                          {r.isActive ? "Deactivate" : "Activate"}
                        </button>
                      </form>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </main>
  );
}