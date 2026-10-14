import ResourceForm from "../ResourceForm";
import { createResource } from "../actions";

export default function NewResourcePage() {
  return (
    <div className="mx-auto max-w-5xl p-6">
      <h1 className="mb-4 text-2xl font-bold">Add resource</h1>
      <ResourceForm action={createResource} />
    </div>
  );
}