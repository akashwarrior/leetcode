"use client";

import { cn } from "@/lib/utils";
import { useMemo, useState } from "react";
import { AnimatePresence, motion } from "motion/react";
import type { Activity } from "@codearena/db";

const DAYS_IN_HEATMAP = 364;

const DAYS = ["", "Mon", "", "Wed", "", "Fri", ""] as const;
const LEVELS = [
  { min: 0, max: 0, bg: "bg-success/10", label: "No activity" },
  { min: 1, max: 1, bg: "bg-success/25", label: "1 submission" },
  { min: 2, max: 2, bg: "bg-success/40", label: "2 submissions" },
  { min: 3, max: 3, bg: "bg-success/60", label: "3 submissions" },
  { min: 4, max: Infinity, bg: "bg-success", label: "4+ submissions" },
] as const;

function getLevel(count: number) {
  return LEVELS.find((l) => count >= l.min && count <= l.max) ?? LEVELS[0];
}

function getWeeks(data: Pick<Activity, "date" | "submissionCount">[]) {
  const countByIndex = new Map(
    data.map((d) => [
      new Date(d.date).toISOString().split("T")[0],
      d.submissionCount,
    ]),
  );
  const today = new Date();
  const weeks: Pick<Activity, "date" | "submissionCount">[][] = [];

  const cursor = new Date(today);
  cursor.setDate(cursor.getDate() - DAYS_IN_HEATMAP);
  cursor.setDate(cursor.getDate() - cursor.getDay());

  let week: Pick<Activity, "date" | "submissionCount">[] = [];

  while (cursor <= today) {
    const dateStr = cursor.toISOString().split("T")[0];
    week.push({
      date: new Date(cursor),
      submissionCount: countByIndex.get(dateStr) ?? 0,
    });
    if (week.length === 7) {
      weeks.push(week);
      week = [];
    }
    cursor.setDate(cursor.getDate() + 1);
  }
  if (week.length) weeks.push(week);
  return weeks;
}

const MONTHS_SHORT = [
  "Jan",
  "Feb",
  "Mar",
  "Apr",
  "May",
  "Jun",
  "Jul",
  "Aug",
  "Sep",
  "Oct",
  "Nov",
  "Dec",
];

const cellSize = 12;
const gap = 2;
const dayLabelWidth = 28;
const weekWidth = cellSize + gap;

type ActivityHeatmapProps = {
  data: Pick<Activity, "date" | "submissionCount">[];
};

export function ActivityHeatmap({ data }: ActivityHeatmapProps) {
  const weeks = useMemo(() => getWeeks(data), [data]);
  const [tooltip, setTooltip] = useState<{
    date: string;
    count: number;
    x: number;
    y: number;
  } | null>(null);

  const totalSubmissions = useMemo(
    () => data.reduce((sum, day) => sum + day.submissionCount, 0),
    [data],
  );

  const maxStreak = useMemo(() => {
    let max = 0;
    let current = 0;
    let lastDate: Date | null = null;
    const sorted = [...data].sort(
      (left, right) =>
        new Date(left.date).getTime() - new Date(right.date).getTime(),
    );

    for (const day of sorted) {
      const currentDate = new Date(day.date);
      if (day.submissionCount > 0) {
        if (lastDate) {
          const diffDays = Math.round(
            (currentDate.getTime() - lastDate.getTime()) / 86400000,
          );
          if (diffDays === 1) {
            current += 1;
          } else {
            current = 1;
          }
        } else {
          current = 1;
        }
        max = Math.max(max, current);
        lastDate = currentDate;
      } else {
        current = 0;
      }
    }

    return max;
  }, [data]);

  const monthLabels = useMemo(() => {
    const labels: { label: string; weekIndex: number }[] = [];
    let lastMonth = -1;
    weeks.forEach((week, weekIndex) => {
      const firstDay = week[0];
      if (firstDay && firstDay.date.getMonth() !== lastMonth) {
        lastMonth = firstDay.date.getMonth();
        labels.push({ label: MONTHS_SHORT[lastMonth]!, weekIndex });
      }
    });
    return labels;
  }, [weeks]);

  return (
    <div className="gap-3 flex flex-col overflow-hidden">
      <div className="flex gap-5 text-xs text-secondary">
        <span>
          <span className="font-semibold text-primary">{totalSubmissions}</span>{" "}
          submissions
        </span>

        <span>
          Max streak:{" "}
          <span className="font-semibold text-primary">{maxStreak}</span> days
        </span>
      </div>

      <div className="relative">
        <div
          className="flex pl-7 mb-1.5 h-3"
          style={{ width: `${dayLabelWidth + weeks.length * weekWidth}px` }}
        >
          {monthLabels.map(({ label, weekIndex }, i) => {
            return (
              <span
                key={i}
                className="absolute text-[10px] text-secondary/70 font-medium"
                style={{
                  left: `${dayLabelWidth + weekIndex * weekWidth}px`,
                  transform: "translateX(0)",
                }}
              >
                {label}
              </span>
            );
          })}
        </div>

        <div className="flex overflow-hidden">
          <div
            className="flex flex-col justify-around text-[9px] text-disabled leading-none font-medium"
            style={{
              width: `${dayLabelWidth}px`,
              height: `${7 * cellSize + 6 * gap}px`,
            }}
          >
            {DAYS.map((d, i) => (
              <div key={i} className="text-right pr-1.5">
                {d}
              </div>
            ))}
          </div>

          <div className="flex gap-0.5 overflow-x-auto overflow-hidden">
            {weeks.map((week, wi) => (
              <div key={wi} className="flex flex-col gap-0.5">
                {week.map(({ date, submissionCount }, idx) => {
                  const level = getLevel(submissionCount);
                  return (
                    <div
                      key={idx}
                      className={cn(
                        "rounded-sm cursor-pointer transition-transform duration-150 hover:scale-110 size-3",
                        level.bg,
                      )}
                      onMouseEnter={(e) => {
                        const rect = e.currentTarget.getBoundingClientRect();
                        setTooltip({
                          date: date.toLocaleDateString("en-US", {
                            month: "short",
                            day: "numeric",
                            year: "numeric",
                          }),
                          count: submissionCount,
                          x: rect.left + rect.width / 2,
                          y: rect.top - 8,
                        });
                      }}
                      onMouseLeave={() => setTooltip(null)}
                    />
                  );
                })}
              </div>
            ))}
          </div>
        </div>
      </div>

      <div className="flex items-center justify-end gap-1.5 text-[10px] text-secondary/70">
        <span className="mr-0.5 font-medium">Less</span>
        {LEVELS.map((l, i) => (
          <div
            key={i}
            className={cn("rounded-sm size-2.5", l.bg)}
            title={l.label}
          />
        ))}
        <span className="ml-0.5 font-medium">More</span>
      </div>

      {tooltip !== null && (
        <AnimatePresence mode="popLayout" propagate>
          <motion.div
            className="fixed z-50 px-2.5 py-1.5 rounded-md bg-popover border border-border text-xs pointer-events-none -translate-x-1/2 -translate-y-full"
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.95 }}
            transition={{ duration: 0.1, ease: "easeOut" }}
            style={{
              left: tooltip.x,
              top: tooltip.y,
            }}
          >
            <div className="flex items-center gap-2">
              <span className="font-semibold tabular-nums text-primary">
                {tooltip.count}
              </span>
              <span className="text-secondary">
                submission{tooltip.count !== 1 ? "s" : ""}
              </span>
            </div>

            <div className="text-disabled text-[10px] mt-0.5">
              {tooltip.date}
            </div>
          </motion.div>
        </AnimatePresence>
      )}
    </div>
  );
}
