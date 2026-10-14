"use client";

import { useActionState } from "react";
import type { FormState } from "./actions";
import { RESOURCE_TYPES } from "@/lib/lib/validations";

type Props = {
  action: (prev: FormState, formData: FormData) => Promise<FormState>;
};

const inputClass = "w-full rounded border border-gray-300 px-3 py-2";

export default function ResourceForm({ action }: Props) {
  const [state, formAction, pending] = useActionState(action, undefined);
  const error = (field: string) => state?.errors?.[field]?.[0];

  return (
    <form action={formAction} className="max-w-lg space-y-4">
      <div>
        <label className="block text-sm font-medium">Name *</label>
        <input name="name" className={inputClass} />
        {error("name") && <p className="text-sm text-red-600">{error("name")}</p>}
      </div>

      <div>
        <label className="block text-sm font-medium">Type *</label>
        <select name="type" defaultValue="ROOM" className={inputClass}>
          {RESOURCE_TYPES.map((t) => (
            <option key={t} value={t}>{t}</option>
          ))}
        </select>
      </div>

      <div>
        <label className="block text-sm font-medium">Location</label>
        <input name="location" className={inputClass} />
      </div>

      <div>
        <label className="block text-sm font-medium">Capacity</label>
        <input name="capacity" type="number" className={inputClass} />
        {error("capacity") && <p className="text-sm text-red-600">{error("capacity")}</p>}
      </div>

      <div>
        <label className="block text-sm font-medium">Description</label>
        <textarea name="description" rows={3} className={inputClass} />
      </div>

      <button
        type="submit"
        disabled={pending}
        className="rounded bg-green-600 px-4 py-2 text-white disabled:opacity-50"
      >
        {pending ? "Saving..." : "Save"}
      </button>
    </form>
  );
}