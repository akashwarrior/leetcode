"use client";

import { cn } from "@/lib/utils";
import { useMemo, useState, useRef } from "react";
import { ACTIVITY_HEATMAP } from "@/lib/dummy-data";
import { AnimatePresence } from "motion/react";
import { motion } from "motion/react";

const DAYS = ["", "Mon", "", "Wed", "", "Fri", ""];
const LEVELS = [
  {
    min: 0,
    max: 0,
    bg: "bg-primary/5 dark:bg-white/[0.03]",
    label: "No activity",
  },
  { min: 1, max: 1, bg: "bg-emerald-500/25", label: "1 submission" },
  { min: 2, max: 2, bg: "bg-emerald-500/40", label: "2 submissions" },
  { min: 3, max: 3, bg: "bg-emerald-500/60", label: "3 submissions" },
  { min: 4, max: Infinity, bg: "bg-emerald-500", label: "4+ submissions" },
];

function getLevel(count: number) {
  return LEVELS.find((l) => count >= l.min && count <= l.max) ?? LEVELS[0];
}

function getWeeks(data: typeof ACTIVITY_HEATMAP) {
  const countByIndex = new Map(data.map((d) => [d.day, d.count]));
  const today = new Date();
  const weeks: { date: Date; count: number }[][] = [];

  const start = new Date(today);
  start.setDate(start.getDate() - 363);
  start.setDate(start.getDate() - start.getDay());

  let week: { date: Date; count: number }[] = [];
  const cursor = new Date(start);
  let dayIndex = 1;

  while (cursor <= today) {
    week.push({
      date: new Date(cursor),
      count: countByIndex.get(dayIndex) ?? 0,
    });
    dayIndex++;
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

export function ActivityHeatmap() {
  const weeks = useMemo(() => getWeeks(ACTIVITY_HEATMAP), []);
  const containerRef = useRef<HTMLDivElement>(null);
  const [tooltip, setTooltip] = useState<{
    date: string;
    count: number;
    x: number;
    y: number;
  } | null>(null);

  const totalSubmissions = useMemo(
    () => ACTIVITY_HEATMAP.reduce((s, d) => s + d.count, 0),
    [],
  );

  const maxStreak = useMemo(() => {
    let max = 0,
      cur = 0;
    const sorted = [...ACTIVITY_HEATMAP].sort((a, b) => a.day - b.day);
    for (const d of sorted) {
      if (d.count > 0) {
        cur++;
        max = Math.max(max, cur);
      } else {
        cur = 0;
      }
    }
    return max;
  }, []);

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
    <div className="gap-3 flex flex-col">
      <div className="flex items-center justify-between">
        <div className="flex gap-5 text-xs text-muted-foreground">
          <span>
            <span className="font-semibold text-foreground">
              {totalSubmissions}
            </span>{" "}
            submissions
          </span>
          <span>
            Max streak:{" "}
            <span className="font-semibold text-foreground">
              {maxStreak}
            </span>{" "}
            days
          </span>
        </div>
      </div>

      <div className="overflow-x-auto" ref={containerRef}>
        <div className="relative min-w-fit">
          <div
            className="flex pl-7 mb-1.5 h-3"
            style={{ width: `${dayLabelWidth + weeks.length * weekWidth}px` }}
          >
            {monthLabels.map(({ label, weekIndex }, i) => {
              return (
                <span
                  key={i}
                  className="absolute text-[10px] text-muted-foreground/50 font-medium"
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

          <div className="flex">
            <div
              className="flex flex-col justify-around text-[9px] text-muted-foreground/40 leading-none font-medium"
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

            <div className="flex gap-0.5">
              {weeks.map((week, wi) => (
                <div key={wi} className="flex flex-col gap-0.5">
                  {week.map((day, idx) => {
                    const level = getLevel(day.count);
                    return (
                      <div
                        key={idx}
                        className={cn(
                          "rounded-xs cursor-pointer transition-transform duration-150 hover:scale-110 size-3",
                          level.bg,
                        )}
                        onMouseEnter={(e) => {
                          const rect = e.currentTarget.getBoundingClientRect();
                          setTooltip({
                            date: day.date.toLocaleDateString("en-US", {
                              month: "short",
                              day: "numeric",
                              year: "numeric",
                            }),
                            count: day.count,
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
      </div>

      <div className="flex items-center justify-end gap-1.5 text-[10px] text-muted-foreground/50">
        <span className="mr-0.5 font-medium">Less</span>
        {LEVELS.map((l, i) => (
          <div
            key={i}
            className={cn("rounded-xs size-2.5", l.bg)}
            title={l.label}
          />
        ))}
        <span className="ml-0.5 font-medium">More</span>
      </div>

      {tooltip !== null && (
        <AnimatePresence mode="popLayout" propagate>
          <motion.div
            className="fixed z-50 px-2.5 py-1.5 rounded-md bg-popover border border-border text-xs pointer-events-none shadow-lg -translate-x-1/2 -translate-y-full"
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.8 }}
            style={{
              left: tooltip.x,
              top: tooltip.y,
            }}
          >
            <div className="flex items-center gap-2">
              <span className="font-semibold tabular-nums">{tooltip.count}</span>
              <span className="text-muted-foreground">
                submission{tooltip.count !== 1 ? "s" : ""}
              </span>
            </div>
            <div className="text-muted-foreground/60 text-[10px] mt-0.5">
              {tooltip.date}
            </div>
          </motion.div>
        </AnimatePresence>
      )}
    </div>
  );
}
