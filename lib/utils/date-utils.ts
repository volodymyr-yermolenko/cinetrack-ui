export function getCurrentYear(): number {
  return new Date().getFullYear();
}

export function formatDateTime(date: Date): string {
  const formattedDate = new Intl.DateTimeFormat("en-US", {
    year: "numeric",
    month: "short",
    day: "numeric",
  }).format(date);

  const formattedTime = new Intl.DateTimeFormat("en-US", {
    hour: "numeric",
    minute: "numeric",
  }).format(date);

  return `${formattedDate} • ${formattedTime}`;
}
