import { notFound } from "next/navigation";
import { getResourceById } from "@/lib/data/resources";
import ResourceForm from "../../ResourceForm";
import { updateResource } from "../../actions";

export const instant = false;

export default async function EditResourcePage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const numericId = Number(id);
  if (!Number.isInteger(numericId)) notFound();

  const resource = await getResourceById(numericId);
  if (!resource) notFound();

  return (
    <div className="mx-auto max-w-5xl p-6">
      <h1 className="mb-4 text-2xl font-bold">Edit resource</h1>
      <ResourceForm
        action={updateResource.bind(null, resource.id)}
        resource={resource}
      />
    </div>
  );
}