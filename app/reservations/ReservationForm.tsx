"use client";

import { useActionState } from "react";
import type { ReservationFormState } from "./actions";

type Props = {
  action: (
    prev: ReservationFormState,
    formData: FormData
  ) => Promise<ReservationFormState>;
  resources: { id: number; name: string }[];
};

const inputClass = "w-full rounded border border-gray-300 px-3 py-2";

export default function ReservationForm({ action, resources }: Props) {
  const [state, formAction, pending] = useActionState(action, undefined);
  const error = (field: string) => state?.errors?.[field]?.[0];
  const value = (field: string) => state?.values?.[field] ?? "";

  return (
    <form action={formAction} className="max-w-lg space-y-4">
      <div>
        <label className="block text-sm font-medium">Resource *</label>
        <select name="resourceId" defaultValue={value("resourceId")} className={inputClass} required>
          <option value="">Select a resource...</option>
          {resources.map((r) => (
            <option key={r.id} value={r.id}>{r.name}</option>
          ))}
        </select>
        {error("resourceId") && <p className="text-sm text-red-600">{error("resourceId")}</p>}
      </div>

      <div>
        <label className="block text-sm font-medium">Your name *</label>
        <input name="bookedByName" defaultValue={value("bookedByName")} className={inputClass} required />
        {error("bookedByName") && <p className="text-sm text-red-600">{error("bookedByName")}</p>}
      </div>

      <div>
        <label className="block text-sm font-medium">Email *</label>
        <input name="bookedByEmail" type="email" defaultValue={value("bookedByEmail")} className={inputClass} required />
        {error("bookedByEmail") && <p className="text-sm text-red-600">{error("bookedByEmail")}</p>}
      </div>

      <div>
        <label className="block text-sm font-medium">Purpose *</label>
        <input name="purpose" defaultValue={value("purpose")} className={inputClass} required />
        {error("purpose") && <p className="text-sm text-red-600">{error("purpose")}</p>}
      </div>

      <div className="grid grid-cols-2 gap-4">
        <div>
          <label className="block text-sm font-medium">Start *</label>
          <input name="startTime" type="datetime-local" defaultValue={value("startTime")} className={inputClass} required />
          {error("startTime") && <p className="text-sm text-red-600">{error("startTime")}</p>}
        </div>
        <div>
          <label className="block text-sm font-medium">End *</label>
          <input name="endTime" type="datetime-local" defaultValue={value("endTime")} className={inputClass} required />
          {error("endTime") && <p className="text-sm text-red-600">{error("endTime")}</p>}
        </div>
      </div>

      <button
        type="submit"
        disabled={pending}
        className="rounded bg-green-600 px-4 py-2 text-white disabled:opacity-50"
      >
        {pending ? "Saving..." : "Book"}
      </button>
    </form>
  );
}