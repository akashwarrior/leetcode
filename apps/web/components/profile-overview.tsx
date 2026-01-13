"use client";

import Link from "next/link";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { ActivityHeatmap } from "@/components/activity-heatmap";
import { CURRENT_USER, PROBLEM_LIST } from "@/lib/dummy-data";
import {
  Trophy,
  CalendarClock,
  Award,
  Star,
  Zap,
  MapPin,
  LinkIcon,
  Github,
  Target,
  TrendingUp,
  MessageSquare,
} from "lucide-react";

const attemptedCount = PROBLEM_LIST.filter(
  (p) => p.status === "ATTEMPTED"
).length;
const easy = PROBLEM_LIST.filter((p) => p.difficulty === "EASY").length;
const medium = PROBLEM_LIST.filter((p) => p.difficulty === "MEDIUM").length;
const hard = PROBLEM_LIST.filter((p) => p.difficulty === "HARD").length;
const totalProblems = PROBLEM_LIST.length;
const easySolved = 1,
  mediumSolved = 2,
  hardSolved = 1;
const totalSolved = easySolved + mediumSolved + hardSolved;

const achievements = [
  {
    label: "First Solve",
    desc: "Solved your first problem",
    icon: Star,
    earned: true,
    color: "text-amber-500",
    bg: "bg-amber-500/10",
  },
  {
    label: "Week Streak",
    desc: "7-day solving streak",
    icon: Zap,
    earned: true,
    color: "text-primary",
    bg: "bg-primary/10",
  },
  {
    label: "Century",
    desc: "Solve 100 problems",
    icon: Award,
    earned: false,
    color: "text-emerald-500",
    bg: "bg-emerald-500/10",
  },
];

function DonutChart() {
  const radius = 44;
  const strokeWidth = 7;
  const circumference = 2 * Math.PI * radius;
  const total = totalProblems;
  const segments = [
    { count: easySolved, color: "#22c55e" },
    { count: mediumSolved, color: "#f59e0b" },
    { count: hardSolved, color: "#ef4444" },
  ];
  let offset = 0;
  const arcs = segments.map((seg) => {
    const fraction = seg.count / total;
    const dash = circumference * fraction;
    const gap = circumference - dash;
    const currentOffset = offset;
    offset += dash;
    return { ...seg, dash, gap, offset: currentOffset };
  });

  return (
    <div className="relative flex items-center justify-center shrink-0">
      <svg
        width="110"
        height="110"
        viewBox="0 0 110 110"
        className="-rotate-90"
      >
        <circle
          cx="55"
          cy="55"
          r={radius}
          fill="none"
          stroke="currentColor"
          className="text-muted/80"
          strokeWidth={strokeWidth}
        />
        {arcs.map((arc, i) => (
          <circle
            key={i}
            cx="55"
            cy="55"
            r={radius}
            fill="none"
            stroke={arc.color}
            strokeWidth={strokeWidth}
            strokeDasharray={`${arc.dash} ${arc.gap}`}
            strokeDashoffset={-arc.offset}
            strokeLinecap="round"
            className="transition-all duration-700"
          />
        ))}
      </svg>
      <div className="absolute inset-0 flex flex-col items-center justify-center">
        <span className="text-2xl font-bold tabular-nums">{totalSolved}</span>
        <span className="text-[10px] text-muted-foreground font-medium">solved</span>
      </div>
    </div>
  );
}

export function ProfileOverview() {
  return (
    <div className="grid gap-6 lg:grid-cols-[260px_1fr]">
      {/* Left sidebar */}
      <div className="space-y-4">
        {/* User card */}
        <div className="surface-card rounded-2xl p-6 text-center">
          <div className="mx-auto flex size-20 items-center justify-center rounded-2xl bg-gradient-to-br from-primary/20 to-purple-500/20 text-2xl font-bold text-primary">
            {CURRENT_USER.name[0]}
          </div>
          <h1 className="mt-4 text-lg font-bold tracking-tight">{CURRENT_USER.name}</h1>
          <p className="text-sm text-muted-foreground">
            @{CURRENT_USER.userName}
          </p>
          <Link href="/settings">
            <Button
              variant="outline"
              size="sm"
              className="mt-5 w-full rounded-xl text-xs font-medium h-9"
            >
              Edit Profile
            </Button>
          </Link>
        </div>

        {/* Info links */}
        <div className="surface-card rounded-2xl p-5 space-y-3.5">
          {[
            { icon: MapPin, label: "India" },
            { icon: LinkIcon, label: "akashgupta.tech", link: true },
            { icon: Github, label: "akashwarrior", link: true },
          ].map((item, i) => (
            <div
              key={i}
              className="flex items-center gap-3 text-sm text-muted-foreground"
            >
              <item.icon
                size={14}
                className="text-muted-foreground/30 shrink-0"
              />
              <span
                className={cn(
                  "truncate",
                  item.link &&
                  "hover:text-primary cursor-pointer transition-colors"
                )}
              >
                {item.label}
              </span>
            </div>
          ))}
        </div>

        {/* Stats grid */}
        <div className="surface-card rounded-2xl p-5">
          <div className="grid grid-cols-2 gap-3">
            {[
              {
                label: "Rank",
                value: `#${CURRENT_USER.rank.toLocaleString()}`,
                icon: Trophy,
                color: "text-amber-500",
                bg: "bg-amber-500/10",
              },
              {
                label: "Contests",
                value: `${CURRENT_USER.contests}`,
                icon: CalendarClock,
                color: "text-primary",
                bg: "bg-primary/10",
              },
            ].map((s) => (
              <div
                key={s.label}
                className="text-center p-3.5 rounded-xl bg-muted/30"
              >
                <div className={cn("mx-auto flex size-8 items-center justify-center rounded-lg mb-2", s.bg)}>
                  <s.icon size={15} className={s.color} />
                </div>
                <p className="text-lg font-bold leading-none tabular-nums">
                  {s.value}
                </p>
                <p className="text-[10px] text-muted-foreground mt-1.5 font-medium uppercase tracking-wider">
                  {s.label}
                </p>
              </div>
            ))}
          </div>
        </div>

        {/* Achievements */}
        <div className="surface-card rounded-2xl p-5">
          <h2 className="section-label mb-4">Achievements</h2>
          <div className="space-y-2">
            {achievements.map((a) => (
              <div
                key={a.label}
                className={cn(
                  "flex items-center gap-3 rounded-xl p-3 transition-all duration-200",
                  a.earned
                    ? "bg-muted/30 hover:bg-muted/50"
                    : "opacity-25"
                )}
              >
                <div
                  className={cn(
                    "flex size-9 items-center justify-center rounded-lg shrink-0",
                    a.bg
                  )}
                >
                  <a.icon size={15} className={a.color} />
                </div>
                <div className="min-w-0">
                  <p className="text-xs font-semibold leading-tight truncate">
                    {a.label}
                  </p>
                  <p className="text-[10px] text-muted-foreground truncate">
                    {a.desc}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Main content */}
      <div className="space-y-5">
        {/* Solved problems */}
        <div className="surface-card rounded-2xl p-6">
          <div className="flex items-center gap-2.5 mb-6">
            <div className="flex size-7 items-center justify-center rounded-lg bg-primary/10">
              <Target size={14} className="text-primary" />
            </div>
            <h2 className="text-sm font-semibold">Solved Problems</h2>
          </div>
          <div className="flex flex-col sm:flex-row items-center gap-8">
            <DonutChart />
            <div className="flex-1 w-full space-y-4">
              {[
                {
                  label: "Easy",
                  solved: easySolved,
                  total: easy,
                  color: "bg-emerald-500",
                  text: "text-emerald-500",
                },
                {
                  label: "Medium",
                  solved: mediumSolved,
                  total: medium,
                  color: "bg-amber-500",
                  text: "text-amber-500",
                },
                {
                  label: "Hard",
                  solved: hardSolved,
                  total: hard,
                  color: "bg-rose-500",
                  text: "text-rose-500",
                },
              ].map((d) => (
                <div key={d.label}>
                  <div className="flex items-center justify-between text-xs mb-2">
                    <span className={cn("font-semibold", d.text)}>
                      {d.label}
                    </span>
                    <span className="font-medium tabular-nums text-muted-foreground">
                      <span className="text-foreground">{d.solved}</span> /{" "}
                      {d.total}
                    </span>
                  </div>
                  <div className="h-[5px] rounded-full bg-muted overflow-hidden">
                    <div
                      className={cn(
                        "h-full rounded-full transition-all duration-700",
                        d.color
                      )}
                      style={{ width: `${(d.solved / d.total) * 100}%` }}
                    />
                  </div>
                </div>
              ))}
              <p className="text-xs text-muted-foreground pt-4 border-t border-border">
                Currently attempting:{" "}
                <span className="font-semibold text-foreground tabular-nums">
                  {attemptedCount}
                </span>{" "}
                problem{attemptedCount !== 1 ? "s" : ""}
              </p>
            </div>
          </div>
        </div>

        {/* Activity */}
        <div className="surface-card rounded-2xl p-6 overflow-x-auto">
          <div className="flex items-center gap-2.5 mb-5">
            <div className="flex size-7 items-center justify-center rounded-lg bg-primary/10">
              <TrendingUp size={14} className="text-primary" />
            </div>
            <span className="text-sm font-semibold">Activity</span>
          </div>
          <div className="mx-2">
            <ActivityHeatmap />
          </div>
        </div>

        {/* Stats grid */}
        <div className="grid gap-4 sm:grid-cols-2">
          {[
            {
              title: "Contest Stats",
              icon: Trophy,
              bg: "bg-amber-500/10",
              color: "text-amber-500",
              items: [
                { label: "Rating", value: "1,484" },
                {
                  label: "Global Ranking",
                  value: `#${CURRENT_USER.rank.toLocaleString()}`,
                },
                { label: "Attended", value: `${CURRENT_USER.contests}` },
                { label: "Top", value: "49.4%" },
              ],
            },
            {
              title: "Community",
              icon: MessageSquare,
              bg: "bg-primary/10",
              color: "text-primary",
              items: [
                { label: "Solutions Shared", value: "12" },
                { label: "Discussions", value: "5" },
                { label: "Reputation", value: "142" },
                { label: "Active Days", value: "60" },
              ],
            },
          ].map((section) => (
            <div key={section.title} className="surface-card rounded-2xl p-5">
              <div className="flex items-center gap-2.5 mb-4">
                <div className={cn("flex size-7 items-center justify-center rounded-lg", section.bg)}>
                  <section.icon size={14} className={section.color} />
                </div>
                <h2 className="text-sm font-semibold">{section.title}</h2>
              </div>
              <div className="space-y-3">
                {section.items.map((item) => (
                  <div
                    key={item.label}
                    className="flex items-center justify-between text-sm"
                  >
                    <span className="text-muted-foreground">{item.label}</span>
                    <span className="font-semibold tabular-nums">
                      {item.value}
                    </span>
                  </div>
                ))}
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
