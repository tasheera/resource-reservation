import { getResources } from "@/lib/data/resources";

export const instant = false;

export default async function ResourcesPage() {
  const resources = await getResources();

  return (
    <main className="min-h-screen bg-[#0a0a0a] px-6 py-10 text-zinc-100 lg:px-10">
      <div className="mx-auto max-w-5xl">
        <p className="mb-3 font-mono text-xs tracking-[0.2em] text-yellow-300">RESERVE / 01</p>
        <h1 className="mb-8 text-4xl font-semibold tracking-tight">Available resources</h1>

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