import { format } from "date-fns";

export function getCurrentYear(): number {
  return new Date().getFullYear();
}

export function getCurrentDate(): Date {
  const now = new Date();
  return new Date(now.getFullYear(), now.getMonth(), now.getDate());
}

export function getFirstDayOfYear(year: number): Date {
  return new Date(year, 0, 1);
}

export function formatDateTime(
  date: Date,
  withoutTime: boolean = false,
): string {
  const formattedDate = new Intl.DateTimeFormat("en-US", {
    year: "numeric",
    month: "short",
    day: "numeric",
  }).format(date);

  if (withoutTime) {
    return formattedDate;
  }

  const formattedTime = new Intl.DateTimeFormat("en-US", {
    hour: "numeric",
    minute: "numeric",
  }).format(date);

  return `${formattedDate} • ${formattedTime}`;
}

export function formatDateForApi(date: Date): string {
  return format(date, "yyyy-MM-dd");
}
