import { getResources } from "@/lib/data/resources";
import Link from "next/link";

export const instant = false;

export default async function ResourcesPage() {
  const resources = await getResources();

  return (
    <main className="min-h-screen bg-[#0a0a0a] px-6 py-10 text-zinc-100 lg:px-10">
      <div className="mx-auto max-w-5xl">
        <p className="mb-3 font-mono text-xs tracking-[0.2em] text-yellow-300">RESERVE / 01</p>
        <div className="mb-4 flex items-center justify-between">
          <h1 className="text-2xl font-bold">Resources</h1>
          <Link href="/resources/new" className="rounded bg-green-600 px-4 py-2 text-white">
            + Add resource
          </Link>
        </div>
        {resources.length === 0 ? (
          <p className="border border-dashed border-zinc-700 px-5 py-8 text-zinc-500">No resources yet.</p>
        ) : (
          <div className="overflow-x-auto border border-zinc-800 bg-zinc-950">
            <table className="w-full min-w-[640px] text-left text-sm">
              <thead className="border-b border-zinc-800 bg-zinc-900 font-mono text-xs uppercase tracking-wider text-zinc-500">
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
                  <tr key={r.id} className="border-b border-zinc-800 text-zinc-300 last:border-0 hover:bg-zinc-900">
                    <td className="px-5 py-4 font-medium text-zinc-100">{r.name}</td>
                    <td>{r.type}</td>
                    <td>{r.location ?? "-"}</td>
                    <td>{r.capacity ?? "-"}</td>
                    <td className={r.isActive ? "text-emerald-400" : "text-zinc-600"}>
                      {r.isActive ? "Active" : "Inactive"}
                    </td>
                    <td>
                      <Link href={`/resources/${r.id}/edit`} className="text-blue-600">
                        Edit
                      </Link>
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