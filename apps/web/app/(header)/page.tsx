import Link from "next/link";
import { cn } from "@/lib/utils";
import { ActivityHeatmap } from "@/components/activity-heatmap";
import { PROBLEM_LIST, CURRENT_USER, CONTESTS, TAGS } from "@/lib/dummy-data";
import {
  Flame,
  CheckCircle2,
  Trophy,
  Calendar,
  ArrowRight,
  Clock,
  Zap,
  TrendingUp,
  BookOpen,
  Circle,
} from "lucide-react";

const stats = [
  {
    label: "Streak",
    value: "12",
    sub: "days",
    icon: Flame,
    color: "text-orange-500",
    bg: "bg-orange-500/10",
  },
  {
    label: "Solved",
    value: "142",
    sub: "problems",
    icon: CheckCircle2,
    color: "text-emerald-500",
    bg: "bg-emerald-500/10",
  },
  {
    label: "Rank",
    value: "#28,472",
    sub: "global",
    icon: Trophy,
    color: "text-amber-500",
    bg: "bg-amber-500/10",
  },
  {
    label: "Rating",
    value: "1,484",
    sub: "points",
    icon: TrendingUp,
    color: "text-primary",
    bg: "bg-primary/10",
  },
];

const dailyChallenge = {
  title: "Longest Palindromic Substring",
  difficulty: "MEDIUM",
  solved: false,
  streak: 5,
};

const learningPaths = [
  { title: "Arrays & Hashing", progress: 75, total: 20, current: 15 },
  { title: "Two Pointers", progress: 40, total: 15, current: 6 },
  { title: "Sliding Window", progress: 20, total: 12, current: 2 },
];

function StatusIcon({ status }: { status?: string }) {
  if (status === "SOLVED")
    return <CheckCircle2 size={14} className="text-emerald-500 shrink-0" />;
  if (status === "ATTEMPTED")
    return <Circle size={14} className="text-amber-500 shrink-0" />;
  return <Circle size={14} className="text-muted-foreground/15 shrink-0" />;
}

export default async function Home() {
  const recent = PROBLEM_LIST.slice(0, 6);
  const easy = PROBLEM_LIST.filter((p) => p.difficulty === "EASY").length;
  const medium = PROBLEM_LIST.filter((p) => p.difficulty === "MEDIUM").length;
  const hard = PROBLEM_LIST.filter((p) => p.difficulty === "HARD").length;
  const upcomingContests = CONTESTS.filter(
    (c) => new Date(c.startTime) > new Date()
  ).slice(0, 2);
  const solvedCount = { easy: 28, medium: 42, hard: 12 };

  return (
    <div className="pb-12 space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-xl font-medium tracking-tight">
            Welcome back, {CURRENT_USER.name.split(" ")[0]}
          </h1>
          <p className="text-sm text-muted-foreground mt-0.5">
            Keep your streak alive today
          </p>
        </div>
        <div className="flex items-center gap-2 text-sm surface-card rounded-lg px-3 py-1.5">
          <Flame size={15} className="text-orange-500" />
          <span className="font-medium tabular-nums">12</span>
          <span className="text-muted-foreground text-xs">day streak</span>
        </div>
      </div>

      <div className="grid gap-3 grid-cols-2 lg:grid-cols-4">
        {stats.map((s) => (
          <div
            key={s.label}
            className="stagger-item surface-card rounded-xl p-4 transition-colors duration-150 hover:border-foreground/10 dark:hover:border-white/12"
          >
            <div className="flex items-center justify-between mb-3">
              <div className={cn("flex size-8 items-center justify-center rounded-lg", s.bg)}>
                <s.icon size={15} className={s.color} />
              </div>
              <span className="text-[10px] font-medium text-muted-foreground/60 uppercase tracking-wider">
                {s.sub}
              </span>
            </div>
            <p className="text-2xl font-medium leading-none tabular-nums tracking-tight">
              {s.value}
            </p>
            <p className="text-xs text-muted-foreground mt-1.5">{s.label}</p>
          </div>
        ))}
      </div>

      <div className="lg:grid gap-5 lg:grid-cols-[1fr_300px]">
        <div className="space-y-5">
          <div className="surface-card rounded-xl p-5">
            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center gap-2.5">
                <div className="flex size-7 items-center justify-center rounded-lg bg-amber-500/10">
                  <Zap size={14} className="text-amber-500" />
                </div>
                <span className="text-sm font-medium">Daily Challenge</span>
              </div>
              <span className="text-[11px] text-muted-foreground px-2 py-0.5 rounded-md bg-muted">
                Day 5 of streak
              </span>
            </div>

            <Link
              href="/problems/longest-palindromic-substring"
              className="flex items-center gap-3 p-3 -mx-1 rounded-lg hover:bg-muted/30 transition-colors group"
            >
              <StatusIcon
                status={dailyChallenge.solved ? "SOLVED" : undefined}
              />

              <div>
                <p className="text-sm font-medium group-hover:text-primary transition-colors">
                  {dailyChallenge.title}
                </p>
                <p className="text-xs text-muted-foreground mt-0.5">
                  Solve to extend your streak
                </p>
              </div>

              <span
                className={cn(
                  "text-[10px] font-medium px-2 py-0.5 rounded-md ml-auto",
                  dailyChallenge.difficulty === "MEDIUM" &&
                  "bg-amber-500/10 text-amber-500"
                )}
              >
                {dailyChallenge.difficulty.toLowerCase()}
              </span>

              <ArrowRight
                size={14}
                className="text-muted-foreground/20 group-hover:text-primary group-hover:translate-x-0.5 transition-all"
              />
            </Link>
          </div>

          <div className="surface-card rounded-xl p-5">
            <div className="flex items-center justify-between mb-4">
              <span className="text-sm font-medium">Activity</span>
              <Link
                prefetch={false}
                href={`/u/${CURRENT_USER.userName}`}
                className="text-xs text-muted-foreground hover:text-foreground transition-colors flex items-center gap-1 group"
              >
                View profile
                <ArrowRight size={10} className="group-hover:translate-x-0.5 transition-transform" />
              </Link>
            </div>

            <ActivityHeatmap />
          </div>

          <div>
            <div className="flex items-center justify-between mb-3">
              <span className="text-sm font-medium">Recent Problems</span>
              <Link
                prefetch={false}
                href="/problems"
                className="text-xs text-muted-foreground hover:text-foreground transition-colors flex items-center gap-1 group"
              >
                View all{" "}
                <ArrowRight size={10} className="group-hover:translate-x-0.5 transition-transform" />
              </Link>
            </div>

            <div className="surface-card rounded-xl overflow-hidden">
              {recent.map((p, i) => (
                <Link
                  key={p.id}
                  prefetch={false}
                  href={`/problems/${p.slug}`}
                  className="flex items-center gap-3 px-4 py-3 hover:bg-muted/30 dark:hover:bg-white/[0.03] transition-colors border-b border-border last:border-0 group"
                >
                  <span className="text-[11px] text-muted-foreground/30 w-4 text-center font-mono shrink-0 tabular-nums">
                    {i + 1}
                  </span>
                  <StatusIcon status={p.status} />
                  <span className="flex-1 truncate text-sm group-hover:text-primary transition-colors">
                    {p.title}
                  </span>
                  <div className="flex items-center gap-2.5">
                    <div className="hidden sm:flex items-center gap-1">
                      {p.tags.slice(0, 2).map((t) => (
                        <span
                          key={t.id}
                          className="text-[10px] text-muted-foreground/70 bg-muted px-1.5 py-0.5 rounded"
                        >
                          {t.name}
                        </span>
                      ))}
                    </div>
                    <span
                      className={cn(
                        "text-[11px] shrink-0 font-medium",
                        p.difficulty === "EASY" && "text-emerald-500",
                        p.difficulty === "MEDIUM" && "text-amber-500",
                        p.difficulty === "HARD" && "text-rose-500"
                      )}
                    >
                      {p.difficulty.toLowerCase()}
                    </span>
                  </div>
                </Link>
              ))}
            </div>
          </div>
        </div>

        <div className="space-y-5">
          <div className="surface-card rounded-xl p-5">
            <h3 className="text-sm font-medium mb-4">Solve Progress</h3>
            <div className="space-y-3.5">
              {[
                {
                  label: "Easy",
                  count: solvedCount.easy,
                  total: easy,
                  bg: "bg-emerald-500",
                  text: "text-emerald-500",
                },
                {
                  label: "Medium",
                  count: solvedCount.medium,
                  total: medium,
                  bg: "bg-amber-500",
                  text: "text-amber-500",
                },
                {
                  label: "Hard",
                  count: solvedCount.hard,
                  total: hard,
                  bg: "bg-rose-500",
                  text: "text-rose-500",
                },
              ].map((d) => (
                <div key={d.label}>
                  <div className="flex justify-between text-xs mb-2">
                    <span className={cn("font-medium", d.text)}>{d.label}</span>
                    <span className="text-muted-foreground font-mono tabular-nums">
                      {d.count}/{d.total}
                    </span>
                  </div>
                  <div className="h-[5px] rounded-full bg-muted overflow-hidden">
                    <div
                      className={cn(
                        "h-full rounded-full transition-all duration-500",
                        d.bg
                      )}
                      style={{ width: `${(d.count / d.total) * 100}%` }}
                    />
                  </div>
                </div>
              ))}
            </div>
            <div className="mt-4 pt-4 border-t border-border flex items-center justify-between text-sm">
              <span className="text-muted-foreground">Total</span>
              <span className="font-medium font-mono tabular-nums">
                {solvedCount.easy + solvedCount.medium + solvedCount.hard}
                <span className="text-muted-foreground">
                  /{easy + medium + hard}
                </span>
              </span>
            </div>
          </div>

          <div className="surface-card rounded-xl p-5">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-sm font-medium">Learning Paths</h3>
              <Link
                prefetch={false}
                href="/problems"
                className="text-xs text-muted-foreground hover:text-foreground transition-colors"
              >
                All
              </Link>
            </div>
            <div className="space-y-2">
              {learningPaths.map((path) => (
                <Link
                  key={path.title}
                  href="/problems"
                  className="flex items-center gap-3 p-2.5 -mx-1 rounded-lg hover:bg-muted/30 dark:hover:bg-white/[0.03] transition-colors group"
                >
                  <div className="flex size-8 items-center justify-center rounded-lg bg-muted shrink-0">
                    <BookOpen size={14} className="text-muted-foreground" />
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-sm truncate group-hover:text-primary transition-colors">
                      {path.title}
                    </p>
                    <div className="flex items-center gap-2 mt-1.5">
                      <div className="flex-1 h-1 rounded-full bg-muted overflow-hidden">
                        <div
                          className="h-full rounded-full bg-primary transition-all duration-500"
                          style={{ width: `${path.progress}%` }}
                        />
                      </div>
                      <span className="text-[10px] text-muted-foreground font-mono tabular-nums">
                        {path.current}/{path.total}
                      </span>
                    </div>
                  </div>
                </Link>
              ))}
            </div>
          </div>

          <div className="surface-card rounded-xl p-5">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-sm font-medium">Upcoming Contests</h3>
              <Link
                prefetch={false}
                href="/contest"
                className="text-xs text-muted-foreground hover:text-foreground transition-colors"
              >
                All
              </Link>
            </div>
            <div className="space-y-1.5">
              {upcomingContests.length > 0 ? (
                upcomingContests.map((c) => (
                  <Link
                    key={c.id}
                    prefetch={false}
                    href={`/contest/${c.id}`}
                    className="flex items-center gap-3 rounded-lg p-2.5 hover:bg-muted/30 dark:hover:bg-white/[0.03] transition-colors group"
                  >
                    <div className="flex size-9 items-center justify-center rounded-lg bg-primary/10 shrink-0">
                      <Calendar size={14} className="text-primary" />
                    </div>
                    <div className="min-w-0 flex-1">
                      <p className="text-sm font-medium truncate group-hover:text-primary transition-colors">
                        {c.name}
                      </p>
                      <p className="text-xs text-muted-foreground flex items-center gap-1.5 mt-0.5">
                        <Clock size={10} />
                        {new Date(c.startTime).toLocaleDateString("en-US", {
                          weekday: "short",
                          month: "short",
                          day: "numeric",
                        })}
                        <span className="text-muted-foreground/30">·</span>
                        {c.problemCount} problems
                      </p>
                    </div>
                  </Link>
                ))
              ) : (
                <p className="text-sm text-muted-foreground text-center py-4">
                  No upcoming contests
                </p>
              )}
            </div>
          </div>

          <div className="surface-card rounded-xl p-5">
            <h3 className="text-sm font-medium mb-3">Topics</h3>
            <div className="flex flex-wrap gap-1.5">
              {TAGS.slice(0, 8).map((tag) => (
                <Link
                  key={tag.id}
                  href={`/problems?tag=${tag.id}`}
                  className="text-xs text-muted-foreground bg-muted px-2.5 py-1 rounded-md hover:text-foreground hover:bg-muted/80 transition-colors"
                >
                  {tag.name}
                </Link>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
