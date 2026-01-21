import { prisma, type ProblemStatus } from "@codearena/db";
import type { Session } from "@/lib/auth";
import Link from "next/link";
import { cn } from "@/lib/utils";
import { ActivityHeatmap } from "@/components/activity-heatmap";
import { StatCard } from "@/components/ui/stat-card";
import { SectionHeader } from "@/components/ui/section-header";
import { StatusIcon } from "@/components/ui/status-icon";
import { DifficultyBadge } from "@/components/ui/difficulty-badge";
import {
  getDailyProblem,
  getProblemTags,
  getProblemTotals,
  getRecentProblems,
  getUpcomingContests,
  getUserActivityHeatmap,
} from "@/lib/db/queries";
import {
  Fire,
  CheckCircle,
  Trophy,
  Calendar,
  ArrowRight,
  Clock,
  Lightning,
  TrendUp,
} from "@phosphor-icons/react/dist/ssr";

function getProgressWidth(count: number, total: number) {
  if (total === 0) return 0;
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

  const dailyProblemId = cachedDailyProblem?.problem.id;
  const dailyProblemStatus = dailyProblemId
    ? await prisma.userProblem
        .findUnique({
          where: {
            userId_problemId: {
              userId: user.id,
              problemId: dailyProblemId,
            },
          },
          select: { status: true },
        })
        .then((r) => r?.status)
    : undefined;

  const dailyProblem = cachedDailyProblem?.problem;
  const recentProblems = cachedRecentProblems.map((p) => ({
    ...p.problem,
    status: p.status,
  }));

  const solvedCount = {
    easy: user.solvedEasy,
    medium: user.solvedMedium,
    hard: user.solvedHard,
  };

  const totalSolved = solvedCount.easy + solvedCount.medium + solvedCount.hard;
  const firstName = user.name?.split(" ")[0] ?? user.username;

  return (
    <div className="pb-12 w-full">
      <div className="flex items-end justify-between gap-4 mb-8">
        <div>
          <p className="font-mono-label mb-1">DASHBOARD</p>
          <h1 className="text-display text-3xl sm:text-4xl tracking-tighter">
            {firstName}
          </h1>
        </div>
        <div className="flex items-center gap-2 text-secondary">
          <Fire size={14} className="status-warning" />
          <span className="text-display text-xl tabular-nums">
            {user.streak}
          </span>
          <span className="font-mono-label">DAY STREAK</span>
        </div>
      </div>

      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 mb-8">
        <StatCard
          label="STREAK"
          value={user.streak}
          sub="DAYS"
          icon={Fire}
          colorClass="status-warning"
        />
        <StatCard
          label="SOLVED"
          value={totalSolved}
          sub="PROBLEMS"
          icon={CheckCircle}
          colorClass="status-success"
        />
        <StatCard
          label="RANK"
          value={
            typeof user.globalRank === "number" ? `#${user.globalRank}` : "—"
          }
          sub="GLOBAL"
          icon={Trophy}
          colorClass="status-warning"
        />
        <StatCard
          label="RATING"
          value={typeof user.rating === "number" ? user.rating : "—"}
          sub="POINTS"
          icon={TrendUp}
        />
      </div>

      <div className="flex flex-col md:grid gap-6 md:grid-cols-[1fr_280px]">
        <div className="flex flex-col gap-6">
          <div className="nothing-card p-5">
            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center gap-2">
                <Lightning size={14} className="status-warning" />
                <span className="text-sm font-medium text-primary">
                  Daily Challenge
                </span>
              </div>
              <span className="font-mono-label">
                Day {Math.max(user.streak, 1)}
              </span>
            </div>

            {dailyProblem ? (
              <Link
                href={`/problems/${dailyProblem.slug}`}
                className="flex items-center gap-3 p-3 -mx-1 rounded-lg hover:bg-muted transition-colors group"
              >
                <StatusIcon status={dailyProblemStatus} />
                <div className="min-w-0 flex-1">
                  <p className="text-sm font-medium truncate group-hover:text-primary transition-colors">
                    {dailyProblem.title}
                  </p>
                  <p className="text-xs text-secondary mt-0.5">
                    Solve to extend your streak
                  </p>
                </div>
                <DifficultyBadge
                  difficulty={dailyProblem.difficulty ?? "EASY"}
                />
                <ArrowRight
                  size={14}
                  className="text-disabled group-hover:text-primary group-hover:translate-x-0.5 transition-all shrink-0"
                />
              </Link>
            ) : (
              <div className="rounded-lg border border-dashed border-border px-4 py-3 text-sm text-secondary">
                Daily challenge not available yet.
              </div>
            )}
          </div>

          <div className="nothing-card p-5">
            <SectionHeader
              title="Activity"
              viewAllHref={`/u/${user.username}`}
              viewAllLabel="View profile"
              className="mb-4"
            />
            <ActivityHeatmap data={activity} />
          </div>

          <div>
            <SectionHeader
              title="Recent Problems"
              viewAllHref="/problems"
              className="mb-3"
            />

            <div className="nothing-card overflow-hidden">
              {recentProblems.length > 0 ? (
                recentProblems.map((problem, i) => (
                  <Link
                    key={problem.id}
                    prefetch={false}
                    href={`/problems/${problem.slug}`}
                    className={cn(
                      "flex items-center gap-3 px-4 py-3 hover:bg-muted transition-colors group",
                      i < recentProblems.length - 1 && "border-b border-border",
                    )}
                  >
                    <StatusIcon status={problem.status} />
                    <span className="flex-1 truncate text-sm group-hover:text-primary transition-colors">
                      {problem.title}
                    </span>
                    <div className="flex items-center gap-2">
                      <div className="hidden sm:flex items-center gap-1">
                        {problem.tags?.slice(0, 2).map((tag) => (
                          <span
                            key={tag.id}
                            className="text-[0.625rem] font-mono uppercase tracking-wider text-secondary bg-muted px-1.5 py-0.5 rounded"
                          >
                            {tag.name}
                          </span>
                        ))}
                      </div>
                      <DifficultyBadge
                        difficulty={problem.difficulty ?? "EASY"}
                      />
                    </div>
                  </Link>
                ))
              ) : (
                <div className="px-4 py-16 text-sm text-center text-secondary">
                  No recent problems available yet.
                </div>
              )}
            </div>
          </div>
        </div>

        <div className="flex flex-col gap-4">
          <div className="nothing-card p-5">
            <h3 className="text-sm font-medium text-primary mb-4">
              Solve Progress
            </h3>
            <div className="space-y-4">
              {(
                [
                  {
                    label: "EASY",
                    count: solvedCount.easy,
                    total: problemTotals.easy,
                    bg: "bg-success",
                    color: "status-success",
                  },
                  {
                    label: "MEDIUM",
                    count: solvedCount.medium,
                    total: problemTotals.medium,
                    bg: "bg-warning",
                    color: "status-warning",
                  },
                  {
                    label: "HARD",
                    count: solvedCount.hard,
                    total: problemTotals.hard,
                    bg: "bg-error",
                    color: "status-error",
                  },
                ] as const
              ).map((item) => (
                <div key={item.label}>
                  <div className="flex justify-between text-xs mb-1.5">
                    <span className={cn("font-mono-label", item.color)}>
                      {item.label}
                    </span>
                    <span className="text-secondary font-mono tabular-nums">
                      {item.count}/{item.total}
                    </span>
                  </div>
                  <div className="h-1 rounded-full bg-muted overflow-hidden">
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
            <div className="mt-4 pt-3 border-t border-border flex items-center justify-between text-xs">
              <span className="font-mono-label">TOTAL</span>
              <span className="text-primary font-mono tabular-nums">
                {totalSolved}
                <span className="text-secondary">/{problemTotals.total}</span>
              </span>
            </div>
          </div>

          <div className="nothing-card p-5">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-sm font-medium text-primary">
                Upcoming Contests
              </h3>
              <Link
                prefetch={false}
                href="/contest"
                className="text-xs text-secondary hover:text-primary transition-colors"
              >
                ALL
              </Link>
            </div>
            <div className="space-y-1">
              {upcomingContests.length > 0 ? (
                upcomingContests.map((contest) => (
                  <Link
                    key={contest.id}
                    prefetch={false}
                    href={`/contest/${contest.id}`}
                    className="flex items-center gap-3 rounded-lg p-2 hover:bg-muted transition-colors group"
                  >
                    <div className="flex size-8 items-center justify-center rounded bg-muted shrink-0">
                      <Calendar size={13} className="text-secondary" />
                    </div>
                    <div className="min-w-0 flex-1">
                      <p className="text-sm font-medium truncate group-hover:text-primary transition-colors">
                        {contest.title}
                      </p>
                      <p className="text-xs text-secondary flex items-center gap-1 mt-0.5">
                        <Clock size={10} />
                        {new Date(contest.startTime).toLocaleDateString(
                          "en-US",
                          {
                            month: "short",
                            day: "numeric",
                          },
                        )}
                        <span className="text-disabled">·</span>
                        {contest.problemCount} problems
                      </p>
                    </div>
                  </Link>
                ))
              ) : (
                <p className="text-xs text-secondary text-center py-3">
                  No upcoming contests
                </p>
              )}
            </div>
          </div>

          <div className="nothing-card p-5">
            <h3 className="text-sm font-medium text-primary mb-3">Topics</h3>
            <div className="flex flex-wrap gap-1.5">
              {tags.map((tag) => (
                <Link
                  key={tag.id}
                  href={`/problems?tag=${tag.id}`}
                  className="text-[0.6875rem] text-secondary bg-muted px-2 py-1 rounded hover:text-primary hover:bg-muted/80 transition-colors"
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
