"use client";

import { useEffect, useMemo, useState } from "react";
import { cn } from "@/lib/utils";

function getParts(target: Date, now: Date) {
  const diff = Math.max(0, target.getTime() - now.getTime());

  return {
    diff,
    days: Math.floor(diff / 86400000),
    hours: Math.floor((diff % 86400000) / 3600000),
    minutes: Math.floor((diff % 3600000) / 60000),
    seconds: Math.floor((diff % 60000) / 1000),
  };
}

type ContestCountdownProps = {
  target: Date | string;
  initialNow?: Date | string;
  className?: string;
  expiredLabel?: string;
  compact?: boolean;
};

export function ContestCountdown({
  target,
  initialNow,
  className,
  expiredLabel = "Started",
  compact = false,
}: ContestCountdownProps) {
  const [now, setNow] = useState(() =>
    initialNow
      ? initialNow instanceof Date
        ? initialNow
        : new Date(initialNow)
      : new Date(),
  );

  useEffect(() => {
    const interval = window.setInterval(() => setNow(new Date()), 1000);

    return () => window.clearInterval(interval);
  }, []);

  const parsedTarget = useMemo(
    () => (target instanceof Date ? target : new Date(target)),
    [target],
  );
  const { diff, days, hours, minutes, seconds } = getParts(parsedTarget, now);

  if (diff === 0) {
    return (
      <span
        className={cn(
          "font-mono text-xs tracking-wider status-success",
          className,
        )}
      >
        {expiredLabel}
      </span>
    );
  }

  return (
    <span className={cn("font-mono tabular-nums text-primary", className)}>
      {days > 0 ? `${days}d ` : null}
      {compact
        ? `${hours}h ${String(minutes).padStart(2, "0")}m`
        : `${hours}h ${String(minutes).padStart(2, "0")}m ${String(seconds).padStart(2, "0")}s`}
    </span>
  );
}
