const APP_TIMEZONE = "Asia/Colombo";

const dateTimeFormat = new Intl.DateTimeFormat("en-GB", {
  timeZone: APP_TIMEZONE,
  dateStyle: "medium",
  timeStyle: "short",
});

export function formatDateTime(date: Date) {
  return dateTimeFormat.format(date);
}

const APP_UTC_OFFSET = "+05:30";

export function parseLocalDateTime(value: string) {
  return new Date(`${value}${APP_UTC_OFFSET}`);
}