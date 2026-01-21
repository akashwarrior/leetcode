export type ContestStatus = "LIVE" | "UPCOMING" | "COMPLETED";

function toDate(value: Date | string) {
  return value instanceof Date ? value : new Date(value);
}

export function getContestStatus(
  startTime: Date | string,
  endTime: Date | string,
  now = new Date(),
): ContestStatus {
  const start = toDate(startTime);
  const end = toDate(endTime);

  if (now < start) {
    return "UPCOMING";
  }

  if (now >= end) {
    return "COMPLETED";
  }

  return "LIVE";
}

export function getContestDurationMinutes(
  startTime: Date | string,
  endTime: Date | string,
) {
  const start = toDate(startTime);
  const end = toDate(endTime);

  return Math.max(0, Math.round((end.getTime() - start.getTime()) / 60000));
}

export function formatContestDateTime(date: Date | string) {
  return toDate(date).toLocaleString("en-US", {
    month: "short",
    day: "numeric",
    year: "numeric",
    hour: "numeric",
    minute: "2-digit",
  });
}
