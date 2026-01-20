import { prisma, type ProblemStatus } from "@codearena/db";
import type { Session } from "@/lib/auth";
import Link from "next/link";
import { cn } from "@/lib/utils";
import { ActivityHeatmap } from "@/components/activity-heatmap";
import {
  getDailyProblem,
  getProblemTags,
  getProblemTotals,
  getRecentProblems,
  getUpcomingContests,
  getUserActivityHeatmap,
} from "@/lib/db/queries";
import {
  Flame,
  CheckCircle2,
  Trophy,
  Calendar,
  ArrowRight,
  Clock,
  Zap,
  TrendingUp,
  Circle,
} from "lucide-react";

function StatusIcon({ status }: { status?: string }) {
  if (status === "SOLVED") {
    return <CheckCircle2 size={14} className="text-emerald-500 shrink-0" />;
  }
  if (status === "ATTEMPTED") {
    return <Circle size={14} className="text-amber-500 shrink-0" />;
  }
  return <Circle size={14} className="text-muted-foreground/15 shrink-0" />;
}

function getProgressWidth(count: number, total: number) {
  if (total === 0) {
    return 0;
  }

  return (count / total) * 100;
}

export default async function Home({ user }: { user: Session["user"] }) {
  const [
    cachedDailyProblem,
    cachedRecentProblems,
    problemTotals,
    upcomingContests,
    tags,
    activity,
  ] = await Promise.all([
    getDailyProblem(),
    getRecentProblems(user.id),
    getProblemTotals(),
    getUpcomingContests(),
    getProblemTags(),
    getUserActivityHeatmap(user.id),
  ]);

  const dailyProblem = { ...cachedDailyProblem?.problem, status: undefined as ProblemStatus | undefined };
  const recentProblems = cachedRecentProblems.map((p) => ({ ...p.problem, status: p.status }));

  if (dailyProblem?.id) {
    const userproblem = await prisma.userProblem.findUnique({
      where: {
        userId_problemId: {
          userId: user.id,
          problemId: dailyProblem.id,
        },
      },
      select: {
        status: true,
      }
    })

    if (userproblem) {
      dailyProblem.status = userproblem.status;
    }
  }


  const solvedCount = {
    easy: user.solvedEasy,
    medium: user.solvedMedium,
    hard: user.solvedHard,
  };

  const totalSolved = solvedCount.easy + solvedCount.medium + solvedCount.hard;
  const firstName = user.name?.split(" ")[0] ?? user.username;

  const stats = [
    {
      label: "Streak",
      value: user.streak,
      sub: "days",
      icon: Flame,
      color: "text-orange-500",
      bg: "bg-orange-500/10",
    },
    {
      label: "Solved",
      value: totalSolved,
      sub: "problems",
      icon: CheckCircle2,
      color: "text-emerald-500",
      bg: "bg-emerald-500/10",
    },
    {
      label: "Rank",
      value: typeof user.globalRank === "number" ? user.globalRank : "N/A",
      sub: "global",
      icon: Trophy,
      color: "text-amber-500",
      bg: "bg-amber-500/10",
    },
    {
      label: "Rating",
      value: typeof user.rating === "number" ? user.rating : "N/A",
      sub: "points",
      icon: TrendingUp,
      color: "text-primary",
      bg: "bg-primary/10",
    },
  ] as const;

  return (
    <div className="pb-12 space-y-6 w-full">
      <div className="flex items-center justify-between gap-4">
        <div>
          <h1 className="text-lg sm:text-xl font-medium tracking-tight">
            Welcome back, {firstName}
          </h1>
          <p className="text-sm text-muted-foreground mt-0.5 line-clamp-1">
            Keep your streak alive today
          </p>
        </div>
        <div className="flex items-center gap-2 text-sm surface-card rounded-lg px-3 py-1.5">
          <Flame size={15} className="text-orange-500" />
          <span className="font-medium tabular-nums">{user.streak}</span>
          <span className="text-muted-foreground text-xs truncate">
            day streak
          </span>
        </div>
      </div>

      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
        {stats.map((stat) => (
          <div
            key={stat.label}
            className="surface-card rounded-xl p-4 transition-colors duration-150 hover:border-foreground/10"
          >
            <div className="flex items-center justify-between mb-3">
              <div
                className={cn(
                  "flex size-7 items-center justify-center rounded-lg",
                  stat.bg,
                )}
              >
                <stat.icon size={14} className={stat.color} />
              </div>
              <span className="text-[10px] font-medium text-muted-foreground/60 uppercase tracking-wider">
                {stat.sub}
              </span>
            </div>
            <p className="text-2xl font-medium leading-none tabular-nums tracking-tight">
              {stat.value}
            </p>
            <p className="text-xs text-muted-foreground mt-1.5">{stat.label}</p>
          </div>
        ))}
      </div>

      <div className="flex flex-col md:grid gap-5 md:grid-cols-[1fr_300px]">
        <div className="space-y-5 flex flex-col overflow-hidden">
          <div className="surface-card rounded-xl p-5">
            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center gap-2.5">
                <div className="flex size-7 items-center justify-center rounded-lg bg-amber-500/10">
                  <Zap size={14} className="text-amber-500" />
                </div>
                <span className="text-sm font-medium">Daily Challenge</span>
              </div>
              <span className="text-[11px] text-muted-foreground px-2 py-0.5 rounded-md bg-muted">
                Day {Math.max(user.streak, 1)} of streak
              </span>
            </div>

            {dailyProblem ? (
              <Link
                href={`/problems/${dailyProblem.slug}`}
                className="flex items-center gap-3 p-3 -mx-1 rounded-lg hover:bg-muted/30 transition-colors group"
              >
                <StatusIcon status={dailyProblem.status} />

                <div>
                  <p className="text-sm font-medium group-hover:text-primary transition-colors">
                    {dailyProblem.title}
                  </p>
                  <p className="text-xs text-muted-foreground mt-0.5">
                    Solve to extend your streak
                  </p>
                </div>

                <span
                  className={cn(
                    "text-[10px] font-medium px-2 py-0.5 rounded-md ml-auto",
                    dailyProblem.difficulty === "EASY" &&
                    "bg-emerald-500/10 text-emerald-500",
                    dailyProblem.difficulty === "MEDIUM" &&
                    "bg-amber-500/10 text-amber-500",
                    dailyProblem.difficulty === "HARD" &&
                    "bg-rose-500/10 text-rose-500",
                  )}
                >
                  {dailyProblem.difficulty?.toLowerCase()}
                </span>

                <ArrowRight
                  size={14}
                  className="text-muted-foreground/20 group-hover:text-primary group-hover:translate-x-0.5 transition-all"
                />
              </Link>
            ) : (
              <div className="rounded-lg border border-dashed border-border px-3 py-4 text-sm text-muted-foreground">
                Daily challenge is not available yet.
              </div>
            )}
          </div>

          <div className="surface-card rounded-xl p-5">
            <div className="flex items-center justify-between mb-4">
              <span className="text-sm font-medium">Activity</span>
              <Link
                prefetch={false}
                href={`/u/${user.username}`}
                className="text-xs text-muted-foreground hover:text-foreground transition-colors flex items-center gap-1 group"
              >
                View profile
                <ArrowRight
                  size={10}
                  className="group-hover:translate-x-0.5 transition-transform"
                />
              </Link>
            </div>

            <ActivityHeatmap data={activity} />
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
                <ArrowRight
                  size={10}
                  className="group-hover:translate-x-0.5 transition-transform"
                />
              </Link>
            </div>

            <div className="surface-card rounded-xl">
              {recentProblems.length > 0 ? (
                recentProblems.map((problem) => (
                  <Link
                    key={problem.id}
                    prefetch={false}
                    href={`/problems/${problem.slug}`}
                    className="flex items-center gap-4 px-4 py-3 hover:bg-muted/30 dark:hover:bg-white/3 transition-colors border-b border-border last:border-0 group"
                  >
                    <StatusIcon status={problem.status} />
                    <span className="flex-1 truncate text-sm group-hover:text-primary transition-colors">
                      {problem.title}
                    </span>
                    <div className="flex items-center gap-2.5">
                      <div className="hidden sm:flex items-center gap-1">
                        {problem.tags?.map((tag) => (
                          <span
                            key={tag.id}
                            className="text-[10px] text-muted-foreground/70 bg-muted px-1.5 py-0.5 rounded"
                          >
                            {tag.name}
                          </span>
                        ))}
                      </div>

                      <span
                        className={cn(
                          "text-[11px] shrink-0 font-medium",
                          problem.difficulty === "EASY" && "text-emerald-500",
                          problem.difficulty === "MEDIUM" && "text-amber-500",
                          problem.difficulty === "HARD" && "text-rose-500",
                        )}
                      >
                        {problem.difficulty?.toLowerCase()}
                      </span>
                    </div>
                  </Link>
                ))
              ) : (
                <div className="px-4 py-24 text-sm text-center text-muted-foreground">
                  No recent problems available yet.
                </div>
              )}
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
                  total: problemTotals.easy,
                  bg: "bg-emerald-500",
                  text: "text-emerald-500",
                },
                {
                  label: "Medium",
                  count: solvedCount.medium,
                  total: problemTotals.medium,
                  bg: "bg-amber-500",
                  text: "text-amber-500",
                },
                {
                  label: "Hard",
                  count: solvedCount.hard,
                  total: problemTotals.hard,
                  bg: "bg-rose-500",
                  text: "text-rose-500",
                },
              ].map((item) => (
                <div key={item.label}>
                  <div className="flex justify-between text-xs mb-2">
                    <span className={cn("font-medium", item.text)}>
                      {item.label}
                    </span>
                    <span className="text-muted-foreground font-mono tabular-nums">
                      {item.count}/{item.total}
                    </span>
                  </div>
                  <div className="h-1.25 rounded-full bg-muted overflow-hidden">
                    <div
                      className={cn(
                        "h-full rounded-full transition-all duration-500",
                        item.bg,
                      )}
                      style={{
                        width: `${getProgressWidth(item.count, item.total)}%`,
                      }}
                    />
                  </div>
                </div>
              ))}
            </div>
            <div className="mt-4 pt-4 border-t border-border flex items-center justify-between text-sm">
              <span className="text-muted-foreground">Total</span>
              <span className="font-medium font-mono tabular-nums">
                {totalSolved}
                <span className="text-muted-foreground">
                  /{problemTotals.total}
                </span>
              </span>
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
                upcomingContests.map((contest) => (
                  <Link
                    key={contest.id}
                    prefetch={false}
                    href={`/contest/${contest.id}`}
                    className="flex items-center gap-3 rounded-lg p-2.5 hover:bg-muted/30 dark:hover:bg-white/3 transition-colors group"
                  >
                    <div className="flex size-9 items-center justify-center rounded-lg bg-primary/10 shrink-0">
                      <Calendar size={14} className="text-primary" />
                    </div>
                    <div className="min-w-0 flex-1">
                      <p className="text-sm font-medium truncate group-hover:text-primary transition-colors">
                        {contest.title}
                      </p>
                      <p className="text-xs text-muted-foreground flex items-center gap-1.5 mt-0.5">
                        <Clock size={10} />
                        {new Date(contest.startTime).toLocaleDateString(
                          "en-US",
                          {
                            weekday: "short",
                            month: "short",
                            day: "numeric",
                          },
                        )}
                        <span className="text-muted-foreground/30">·</span>
                        {contest.problemCount} problems
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
              {tags.map((tag) => (
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
