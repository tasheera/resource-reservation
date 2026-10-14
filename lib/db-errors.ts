export function isOverlapError(error: unknown) {
  const message = error instanceof Error ? error.message : String(error);
  return (
    message.includes("reservation_no_overlap") || message.includes("23P01")
  );
}