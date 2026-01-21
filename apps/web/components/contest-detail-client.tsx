"use client";

import { useEffect, useMemo, useState } from "react";
import Link from "next/link";
import {
  ArrowLeft,
  BarChart3,
  CalendarClock,
  CheckCircle2,
  Crown,
  FileText,
  Lock,
  Medal,
  Target,
  Timer,
  Users,
  Zap,
} from "lucide-react";
import { ContestCountdown } from "@/components/contest-countdown";
import { ContestRegistrationButton } from "@/components/contest-registration-button";
import { buttonVariants } from "@/components/ui/button";
import {
  getContestDurationMinutes,
  getContestStatus,
  type ContestStatus,
} from "@/lib/contest";
import { cn } from "@/lib/utils";

type LeaderboardEntry = {
  rank: number;
  username: string;
  score: number;
  penalty: number;
};

type ContestProblemItem = {
  id: string;
  slug: string;
  title: string;
  difficulty: "EASY" | "MEDIUM" | "HARD";
  order: string;
  points: number;
};

type ContestDetailClientProps = {
  contest: {
    id: string;
    slug: string;
    title: string;
    description: string | null;
    startTime: string;
    endTime: string;
    startLabel: string;
    problemCount: number;
    participantCount: number;
    problems: ContestProblemItem[];
    leaderboard: LeaderboardEntry[];
  };
  isAuthed: boolean;
  isRegistered: boolean;
  initialNow: string;
};

function RankBadge({ rank }: { rank: number }) {
  if (rank === 1) {
    return <Crown size={14} className="text-amber-500" />;
  }

  if (rank === 2) {
    return <Medal size={14} className="text-slate-400" />;
  }

  if (rank === 3) {
    return <Medal size={14} className="text-amber-700" />;
  }

  return (
    <span className="w-4 text-center font-mono text-xs text-muted-foreground">
      {rank}
    </span>
  );
}

function difficultyClassName(difficulty: ContestProblemItem["difficulty"]) {
  if (difficulty === "EASY") {
    return "text-emerald-500";
  }

  if (difficulty === "MEDIUM") {
    return "text-amber-500";
  }

  return "text-rose-500";
}

function statusClassName(status: ContestStatus) {
  if (status === "LIVE") {
    return "bg-emerald-500/10 text-emerald-500";
  }

  if (status === "UPCOMING") {
    return "bg-primary/10 text-primary";
  }

  return "bg-muted text-muted-foreground";
}

export function ContestDetailClient({
  contest,
  isAuthed,
  isRegistered,
  initialNow,
}: ContestDetailClientProps) {
  const [now, setNow] = useState(() => new Date(initialNow));

  useEffect(() => {
    const interval = window.setInterval(() => setNow(new Date()), 1000);

    return () => window.clearInterval(interval);
  }, []);

  const status = getContestStatus(contest.startTime, contest.endTime, now);
  const duration = getContestDurationMinutes(
    contest.startTime,
    contest.endTime,
  );
  const isUpcoming = status === "UPCOMING";
  const isLive = status === "LIVE";
  const isPast = status === "COMPLETED";
  const statusLabel = isLive ? "Live" : isUpcoming ? "Upcoming" : "Completed";

  const rules = useMemo(
    () => [
      `The contest contains ${contest.problemCount} algorithmic problems.`,
      "Problems unlock when the contest starts and remain available after the round ends.",
      "Standings are ordered by score first, then by lower penalty.",
      "Each problem may be submitted multiple times before the contest closes.",
      "Live standings depend on recorded participation and scoring data.",
    ],
    [contest.problemCount],
  );

  const primaryProblem = contest.problems[0];
  const quickFacts = [
    { label: "Start", value: contest.startLabel, icon: CalendarClock },
    { label: "Duration", value: `${duration} minutes`, icon: Timer },
    {
      label: "Field",
      value: `${contest.participantCount.toLocaleString()} participants`,
      icon: Users,
    },
  ] as const;
  const snapshotItems = [
    {
      label: "Problems",
      value: `${contest.problemCount} linked`,
      icon: Zap,
      color: "text-primary",
    },
    {
      label: "Scoring",
      value: "Score, then penalty",
      icon: Target,
      color: "text-emerald-500",
    },
    {
      label: "Status",
      value: isLive
        ? "Running now"
        : isUpcoming
          ? "Registration open"
          : "Contest closed",
      icon: BarChart3,
      color: "text-violet-500",
    },
  ] as const;
  const heroTitle = isUpcoming
    ? "Registration window"
    : isLive
      ? "Round in progress"
      : "Contest archive";
  const heroBody = isUpcoming
    ? "Register now and be ready when the problem set unlocks."
    : isLive
      ? "Problems and standings are live. Jump in while the clock is still running."
      : "Review the standings and reopen the full contest problem set.";

  return (
    <div className="space-y-8 pb-10">
      <Link
        prefetch={false}
        href="/contest"
        className="inline-flex items-center gap-2 text-sm text-muted-foreground transition-colors hover:text-foreground"
      >
        <ArrowLeft size={14} />
        All Contests
      </Link>

      <section className="relative overflow-hidden rounded-[28px] border border-border bg-card">
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_top_left,oklch(0.7_0.18_275_/_0.16),transparent_34%),radial-gradient(circle_at_bottom_right,oklch(0.73_0.15_160_/_0.12),transparent_28%)]" />
        <div className="absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-white/20 to-transparent dark:via-white/10" />

        <div className="relative px-5 py-6 sm:px-7 sm:py-7">
          <div className="grid gap-8 lg:grid-cols-[minmax(0,1.45fr)_320px]">
            <div className="space-y-6">
              <div className="flex flex-wrap items-center gap-2">
                <span
                  className={cn(
                    "inline-flex items-center gap-1.5 rounded-full px-3 py-1 text-[11px] font-medium uppercase tracking-[0.08em]",
                    statusClassName(status),
                  )}
                >
                  {isLive ? (
                    <span className="size-1.5 rounded-full bg-emerald-500 animate-pulse" />
                  ) : null}
                  {statusLabel}
                </span>
                {isRegistered && !isPast ? (
                  <span className="rounded-full bg-emerald-500/10 px-3 py-1 text-[11px] font-medium uppercase tracking-[0.08em] text-emerald-500">
                    Registered
                  </span>
                ) : null}
              </div>

              <div className="max-w-3xl space-y-3">
                <h1 className="text-3xl font-medium tracking-tight sm:text-4xl">
                  {contest.title}
                </h1>
                <p className="max-w-2xl text-sm leading-6 text-muted-foreground sm:text-[15px]">
                  {contest.description ??
                    "A ranked coding contest with live standings, timed problems, and post-round review."}
                </p>
              </div>

              <div className="grid gap-3 sm:grid-cols-3">
                {quickFacts.map((item) => (
                  <div
                    key={item.label}
                    className="rounded-2xl border border-border/70 bg-background/60 px-4 py-3 backdrop-blur-sm"
                  >
                    <div className="mb-2 flex items-center gap-2 text-[11px] uppercase tracking-[0.08em] text-muted-foreground">
                      <item.icon size={12} />
                      {item.label}
                    </div>
                    <p className="text-sm font-medium leading-5">
                      {item.value}
                    </p>
                  </div>
                ))}
              </div>
            </div>

            <div className="flex flex-col justify-between gap-4 rounded-[24px] border border-border/70 bg-background/65 p-5 backdrop-blur-sm">
              <div>
                <p className="text-[11px] uppercase tracking-[0.08em] text-muted-foreground">
                  {heroTitle}
                </p>
                <p className="mt-2 text-base font-medium leading-6">
                  {heroBody}
                </p>
              </div>

              <div className="space-y-3">
                {isUpcoming ? (
                  <div className="rounded-2xl bg-primary/8 px-4 py-3">
                    <p className="text-[11px] uppercase tracking-[0.08em] text-muted-foreground">
                      Starts in
                    </p>
                    <ContestCountdown
                      target={contest.startTime}
                      initialNow={now}
                      className="mt-1 text-xl font-medium"
                    />
                  </div>
                ) : null}

                {isLive ? (
                  <div className="rounded-2xl bg-emerald-500/8 px-4 py-3">
                    <p className="text-[11px] uppercase tracking-[0.08em] text-muted-foreground">
                      Ends in
                    </p>
                    <ContestCountdown
                      target={contest.endTime}
                      initialNow={now}
                      expiredLabel="Finalizing"
                      className="mt-1 text-xl font-medium"
                    />
                  </div>
                ) : null}

                <div className="flex flex-wrap gap-2">
                  {isUpcoming ? (
                    <ContestRegistrationButton
                      contestId={contest.id}
                      contestTitle={contest.title}
                      initialRegistered={isRegistered}
                      className="h-10 min-w-36 flex-1"
                    />
                  ) : null}

                  {isLive ? (
                    <Link
                      prefetch={false}
                      href={
                        primaryProblem
                          ? `/problems/${primaryProblem.slug}`
                          : "#problem-set"
                      }
                      className={cn(
                        buttonVariants({ size: "default" }),
                        "gradient-primary h-10 flex-1 border-0 text-white",
                      )}
                    >
                      {primaryProblem ? "Start solving" : "Open contest"}
                    </Link>
                  ) : null}

                  {isPast ? (
                    <>
                      <Link
                        prefetch={false}
                        href="#problem-set"
                        className={cn(
                          buttonVariants({ variant: "outline" }),
                          "h-10 flex-1 min-w-32",
                        )}
                      >
                        View Problems
                      </Link>
                      <Link
                        prefetch={false}
                        href="#leaderboard"
                        className={cn(
                          buttonVariants({ variant: "outline" }),
                          "h-10 flex-1 min-w-32",
                        )}
                      >
                        View Rankings
                      </Link>
                    </>
                  ) : null}
                </div>

                {isRegistered && isUpcoming ? (
                  <div className="flex items-center gap-2 text-xs text-emerald-500">
                    <CheckCircle2 size={14} />
                    <span>You are registered for this contest</span>
                  </div>
                ) : null}
              </div>
            </div>
          </div>
        </div>
      </section>

      <div className="grid gap-8 lg:grid-cols-[minmax(0,1fr)_320px]">
        <div className="space-y-8">
          <section id="problem-set" className="space-y-4">
            <div className="flex items-end justify-between gap-4 border-b border-border pb-3">
              <div>
                <p className="text-[11px] uppercase tracking-[0.08em] text-muted-foreground">
                  Workspace
                </p>
                <h2 className="mt-1 text-lg font-medium">Problem Set</h2>
              </div>
              <p className="text-sm text-muted-foreground">
                {isUpcoming
                  ? "Problems unlock when the round begins."
                  : "Open each linked problem directly from this contest."}
              </p>
            </div>

            {isUpcoming ? (
              <div className="overflow-hidden rounded-[24px] border border-border bg-card">
                <div className="border-b border-border px-5 py-4">
                  <div className="flex items-center gap-2">
                    <Lock size={14} className="text-muted-foreground" />
                    <span className="text-sm font-medium">
                      Locked Until Start
                    </span>
                  </div>
                </div>
                <div className="space-y-3 p-5">
                  {Array.from(
                    { length: contest.problemCount || 4 },
                    (_, index) => (
                      <div
                        key={`locked-${index}`}
                        className="flex items-center gap-4 rounded-2xl border border-border/70 bg-muted/15 px-4 py-3"
                      >
                        <span className="flex size-8 shrink-0 items-center justify-center rounded-xl bg-muted text-xs font-medium text-muted-foreground/40">
                          {String.fromCharCode(65 + index)}
                        </span>
                        <div className="min-w-0 flex-1">
                          <div className="h-2.5 w-28 rounded-full bg-muted/60" />
                          <div className="mt-2 h-2.5 w-40 rounded-full bg-muted/40" />
                        </div>
                        <Lock
                          size={12}
                          className="shrink-0 text-muted-foreground/25"
                        />
                      </div>
                    ),
                  )}
                </div>
              </div>
            ) : contest.problems.length > 0 ? (
              <div className="overflow-hidden rounded-[24px] border border-border bg-card">
                {contest.problems.map((problem, index) => (
                  <Link
                    key={problem.id}
                    prefetch={false}
                    href={`/problems/${problem.slug}`}
                    className={cn(
                      "group grid items-center gap-4 px-5 py-4 transition-colors hover:bg-muted/25 sm:grid-cols-[3rem_minmax(0,1fr)_100px_80px]",
                      index !== contest.problems.length - 1 &&
                        "border-b border-border",
                    )}
                  >
                    <div className="flex size-11 items-center justify-center rounded-2xl bg-muted text-sm font-medium">
                      {problem.order}
                    </div>
                    <div className="min-w-0">
                      <p className="truncate text-sm font-medium transition-colors group-hover:text-primary sm:text-[15px]">
                        {problem.title}
                      </p>
                      <p className="mt-1 text-xs text-muted-foreground">
                        {problem.points} points
                      </p>
                    </div>
                    <div className="text-sm font-medium tabular-nums text-muted-foreground sm:text-right">
                      {problem.points} pts
                    </div>
                    <div
                      className={cn(
                        "text-xs font-medium uppercase tracking-[0.08em] sm:text-right",
                        difficultyClassName(problem.difficulty),
                      )}
                    >
                      {problem.difficulty}
                    </div>
                  </Link>
                ))}
              </div>
            ) : (
              <div className="rounded-[24px] border border-dashed border-border px-5 py-12 text-center text-sm text-muted-foreground">
                No problems have been linked to this contest yet.
              </div>
            )}
          </section>

          <section id="leaderboard" className="space-y-4">
            <div className="flex items-end justify-between gap-4 border-b border-border pb-3">
              <div>
                <p className="text-[11px] uppercase tracking-[0.08em] text-muted-foreground">
                  Standings
                </p>
                <h2 className="mt-1 text-lg font-medium">
                  {isLive
                    ? "Live Leaderboard"
                    : isPast
                      ? "Final Standings"
                      : "Leaderboard"}
                </h2>
              </div>
              <p className="text-sm text-muted-foreground">
                {isUpcoming
                  ? "Visible once the contest starts."
                  : "Ordered by score first, then lower penalty."}
              </p>
            </div>

            {isUpcoming ? (
              <div className="rounded-[24px] border border-border bg-card p-10 text-center">
                <div className="mx-auto flex size-12 items-center justify-center rounded-2xl bg-muted">
                  <Lock size={20} className="text-muted-foreground" />
                </div>
                <p className="mt-4 text-sm font-medium">Leaderboard Hidden</p>
                <p className="mt-1 text-sm text-muted-foreground">
                  Problems and standings unlock once the contest starts.
                </p>
              </div>
            ) : contest.leaderboard.length > 0 ? (
              <div className="overflow-hidden rounded-[24px] border border-border bg-card">
                <div className="grid grid-cols-[2.75rem_minmax(0,1fr)_5rem_5rem] gap-4 border-b border-border px-5 py-3 text-[11px] uppercase tracking-[0.08em] text-muted-foreground">
                  <span className="text-center">Rank</span>
                  <span>Coder</span>
                  <span className="text-right">Score</span>
                  <span className="text-right">Penalty</span>
                </div>
                {contest.leaderboard.map((entry, index) => (
                  <Link
                    key={`${entry.username}-${entry.rank}`}
                    prefetch={false}
                    href={`/u/${entry.username}`}
                    className={cn(
                      "group grid grid-cols-[2.75rem_minmax(0,1fr)_5rem_5rem] items-center gap-4 px-5 py-3.5 text-sm transition-colors hover:bg-muted/25",
                      index !== contest.leaderboard.length - 1 &&
                        "border-b border-border",
                    )}
                  >
                    <div className="flex justify-center">
                      <RankBadge rank={entry.rank} />
                    </div>
                    <span className="truncate font-medium text-muted-foreground transition-colors group-hover:text-primary">
                      {entry.username}
                    </span>
                    <span className="text-right font-mono tabular-nums">
                      {entry.score}
                    </span>
                    <span className="text-right font-mono text-xs tabular-nums text-muted-foreground">
                      {entry.penalty}
                    </span>
                  </Link>
                ))}
              </div>
            ) : (
              <div className="rounded-[24px] border border-border bg-card p-10 text-center text-sm text-muted-foreground">
                Standings will appear once participants are scored for this
                contest.
              </div>
            )}
          </section>

          <section className="space-y-4">
            <div className="border-b border-border pb-3">
              <p className="text-[11px] uppercase tracking-[0.08em] text-muted-foreground">
                Format
              </p>
              <h2 className="mt-1 text-lg font-medium">Rules</h2>
            </div>

            <div className="overflow-hidden rounded-[24px] border border-border bg-card">
              {rules.map((rule, index) => (
                <div
                  key={rule}
                  className={cn(
                    "flex gap-4 px-5 py-4",
                    index !== rules.length - 1 && "border-b border-border",
                  )}
                >
                  <span className="mt-0.5 flex size-7 shrink-0 items-center justify-center rounded-xl bg-muted text-xs font-medium text-muted-foreground tabular-nums">
                    {index + 1}
                  </span>
                  <p className="text-sm leading-6 text-muted-foreground">
                    {rule}
                  </p>
                </div>
              ))}
            </div>
          </section>
        </div>

        <aside className="space-y-5 lg:sticky lg:top-20 lg:self-start">
          <div className="overflow-hidden rounded-[24px] border border-border bg-card">
            <div className="border-b border-border px-5 py-4">
              <h3 className="text-sm font-medium">Contest Snapshot</h3>
            </div>
            <div className="space-y-1 p-3">
              {snapshotItems.map((item) => (
                <div
                  key={item.label}
                  className="flex items-center gap-3 rounded-2xl px-3 py-3 hover:bg-muted/25"
                >
                  <div
                    className={cn(
                      "flex size-10 items-center justify-center rounded-2xl bg-muted",
                      item.color,
                    )}
                  >
                    <item.icon size={16} />
                  </div>
                  <div className="min-w-0 flex-1">
                    <p className="text-[11px] uppercase tracking-[0.08em] text-muted-foreground">
                      {item.label}
                    </p>
                    <p className="mt-1 text-sm font-medium">{item.value}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>

          <div className="overflow-hidden rounded-[24px] border border-border bg-card">
            <div className="border-b border-border px-5 py-4">
              <div className="flex items-center gap-2">
                <FileText size={14} className="text-muted-foreground" />
                <h3 className="text-sm font-medium">Access</h3>
              </div>
            </div>
            <div className="space-y-3 p-5 text-sm text-muted-foreground">
              <p>
                {isUpcoming
                  ? "Register now to hold your spot before the round opens."
                  : isLive
                    ? "The contest is active. Open the first problem and start submitting."
                    : "This round is closed, but the archive remains available for review."}
              </p>

              <div className="flex flex-col gap-2">
                {isLive ? (
                  <Link
                    prefetch={false}
                    href={
                      primaryProblem
                        ? `/problems/${primaryProblem.slug}`
                        : "#problem-set"
                    }
                    className={cn(
                      buttonVariants({ size: "default" }),
                      "gradient-primary border-0 text-white",
                    )}
                  >
                    {primaryProblem ? "Open first problem" : "Open contest"}
                  </Link>
                ) : null}

                {isPast ? (
                  <Link
                    prefetch={false}
                    href="#problem-set"
                    className={buttonVariants({ variant: "outline" })}
                  >
                    Browse problem set
                  </Link>
                ) : null}
              </div>
            </div>
          </div>
        </aside>
      </div>
    </div>
  );
}
