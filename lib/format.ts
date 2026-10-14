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

const timeFormat = new Intl.DateTimeFormat("en-GB", {
  timeZone: APP_TIMEZONE,
  hour: "2-digit",
  minute: "2-digit",
  hourCycle: "h23",
});

export function formatTime(date: Date) {
  return timeFormat.format(date);
}

export function todayInAppTimezone() {
  return new Intl.DateTimeFormat("en-CA", { timeZone: APP_TIMEZONE }).format(new Date());
}

export function shiftDate(date: string, days: number) {
  const [y, m, d] = date.split("-").map(Number);
  return new Date(Date.UTC(y, m - 1, d + days)).toISOString().slice(0, 10);
}