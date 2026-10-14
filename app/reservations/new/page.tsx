import Link from "next/link";
import { getActiveResources } from "@/lib/data/resources";
import ReservationForm from "../ReservationForm";
import { createReservation } from "../actions";

export const instant = false;

export default async function NewReservationPage() {
  const resources = await getActiveResources();

  return (
    <div className="mx-auto max-w-5xl p-6">
      <h1 className="mb-4 text-2xl font-bold">New reservation</h1>

      {resources.length === 0 ? (
        <p className="text-gray-500">
          There are no active resources to book.{" "}
          <Link href="/resources" className="text-blue-600 underline">
            Go to resources
          </Link>
        </p>
      ) : (
        <ReservationForm action={createReservation} resources={resources} />
      )}
    </div>
  );
}