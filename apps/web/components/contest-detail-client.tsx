"use client";

import { useEffect, useMemo, useState } from "react";
import { cn } from "@/lib/utils";
import Link from "next/link";
import { ContestCountdown } from "@/components/contest-countdown";
import { ContestRegistrationButton } from "@/components/contest-registration-button";
import { buttonVariants } from "@/components/ui/button";
import {
  getContestDurationMinutes,
  getContestStatus,
  type ContestStatus,
} from "@/lib/contest";
import {
  ArrowLeft,
  Calendar,
  CheckCircle,
  Clock,
  Crown,
  FileText,
  Lock,
  Medal,
  Target,
  Trophy,
  Users,
} from "@phosphor-icons/react";
import { useRouter } from "next/navigation";

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
  if (rank === 1) return <Crown size={14} className="status-warning" />;
  if (rank === 2) return <Medal size={14} className="text-secondary" />;
  if (rank === 3) return <Medal size={14} className="text-secondary" />;
  return (
    <span className="w-4 text-center font-mono text-xs text-disabled">
      {rank}
    </span>
  );
}

function difficultyClassName(difficulty: ContestProblemItem["difficulty"]) {
  if (difficulty === "EASY") return "status-success";
  if (difficulty === "MEDIUM") return "status-warning";
  return "status-error";
}

function statusClassName(status: ContestStatus) {
  if (status === "LIVE") return "status-success";
  if (status === "UPCOMING") return "text-primary";
  return "text-disabled";
}

export function ContestDetailClient({
  contest,
  isRegistered,
  initialNow,
}: ContestDetailClientProps) {
  const router = useRouter();
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

  return (
    <div className="space-y-6 pb-10">
      <button
        onClick={router.back}
        className="flex items-center gap-1.5 text-sm text-secondary transition-colors duration-200 ease-out hover:text-primary cursor-pointer"
      >
        <ArrowLeft size={14} />
        All Contests
      </button>

      <section className="nothing-card p-5 sm:p-6">
        <div className="grid gap-6 lg:grid-cols-[1fr_280px]">
          <div className="space-y-4">
            <div className="flex flex-wrap items-center gap-2">
              <span
                className={cn(
                  "inline-flex items-center gap-1.5 px-2 py-0.5 text-xs font-medium",
                  statusClassName(status),
                )}
              >
                {isLive && (
                  <span className="size-1.5 rounded-full bg-success animate-pulse" />
                )}
                {statusLabel}
              </span>
              {isRegistered && !isPast && (
                <span className="px-2 py-0.5 text-xs font-medium status-success">
                  Registered
                </span>
              )}
            </div>

            <div className="space-y-2">
              <p className="font-mono-label">Contest Detail</p>
              <h1 className="text-display text-2xl sm:text-3xl">
                {contest.title}
              </h1>
              <p className="text-sm text-secondary sm:text-[15px]">
                {contest.description ??
                  "A ranked coding contest with live standings, timed problems, and post-round review."}
              </p>
            </div>

            <div className="flex flex-wrap gap-x-5 gap-y-2 text-sm text-secondary">
              <span className="flex items-center gap-1.5">
                <Calendar size={14} className="text-disabled" />
                {contest.startLabel}
              </span>
              <span className="flex items-center gap-1.5">
                <Clock size={14} className="text-disabled" />
                {duration}m
              </span>
              <span className="flex items-center gap-1.5">
                <Users size={14} className="text-disabled" />
                {contest.participantCount.toLocaleString()} participants
              </span>
            </div>
          </div>

          <div className="flex flex-col gap-4 rounded border border-border p-4">
            {isUpcoming && (
              <div>
                <p className="text-xs text-secondary">Starts in</p>
                <ContestCountdown
                  target={contest.startTime}
                  initialNow={now}
                  className="mt-0.5 text-lg font-medium"
                />
              </div>
            )}

            {isLive && (
              <div>
                <p className="text-xs text-secondary">Ends in</p>
                <ContestCountdown
                  target={contest.endTime}
                  initialNow={now}
                  expiredLabel="Finalizing"
                  className="mt-0.5 text-lg font-medium"
                />
              </div>
            )}

            <div className="flex flex-wrap gap-2">
              {isUpcoming && (
                <ContestRegistrationButton
                  contestId={contest.id}
                  contestTitle={contest.title}
                  initialRegistered={isRegistered}
                  className="flex-1"
                />
              )}

              {isLive && (
                <Link
                  prefetch={false}
                  href={
                    primaryProblem
                      ? `/problems/${primaryProblem.slug}`
                      : "#problem-set"
                  }
                  className={cn(
                    buttonVariants({ size: "default" }),
                    "bg-primary text-primary-foreground hover:bg-primary/90 flex-1",
                  )}
                >
                  {primaryProblem ? "Start solving" : "Open contest"}
                </Link>
              )}

              {isPast && (
                <>
                  <Link
                    prefetch={false}
                    href="#problem-set"
                    className={cn(
                      buttonVariants({ variant: "outline" }),
                      "flex-1",
                    )}
                  >
                    Problems
                  </Link>
                  <Link
                    prefetch={false}
                    href="#leaderboard"
                    className={cn(
                      buttonVariants({ variant: "outline" }),
                      "flex-1",
                    )}
                  >
                    Rankings
                  </Link>
                </>
              )}
            </div>

            {isRegistered && isUpcoming && (
              <div className="flex items-center gap-1.5 text-xs status-success">
                <CheckCircle size={14} />
                <span>Registered</span>
              </div>
            )}
          </div>
        </div>
      </section>

      <div className="grid gap-6 lg:grid-cols-[1fr_280px]">
        <div className="space-y-6">
          <section id="problem-set" className="space-y-3">
            <div className="flex items-center justify-between">
              <div>
                <p className="font-mono-label">Workspace</p>
                <h2 className="text-base font-medium">Problem Set</h2>
              </div>
              <p className="text-xs text-secondary">
                {isUpcoming
                  ? "Unlocks when the round begins."
                  : "Open each problem directly."}
              </p>
            </div>

            {isUpcoming ? (
              <div className="nothing-card">
                <div className="border-b border-border px-4 py-3">
                  <div className="flex items-center gap-2">
                    <Lock size={14} className="text-secondary" />
                    <span className="text-sm font-medium">
                      Locked Until Start
                    </span>
                  </div>
                </div>
                <div className="p-4">
                  <p className="font-mono-label text-xs text-disabled">
                    [LOADING...]
                  </p>
                  <div className="mt-2 space-y-2">
                    {Array.from(
                      { length: contest.problemCount || 4 },
                      (_, index) => (
                        <div
                          key={`locked-${index}`}
                          className="flex items-center gap-3 px-3 py-2.5"
                        >
                          <span className="flex size-7 shrink-0 items-center justify-center font-mono text-xs text-disabled">
                            {String.fromCharCode(65 + index)}
                          </span>
                          <div className="min-w-0 flex-1">
                            <p className="text-sm text-disabled">
                              Problem title
                            </p>
                          </div>
                          <Lock size={12} className="shrink-0 text-disabled" />
                        </div>
                      ),
                    )}
                  </div>
                </div>
              </div>
            ) : contest.problems.length > 0 ? (
              <div className="nothing-card overflow-hidden">
                {contest.problems.map((problem, index) => (
                  <Link
                    key={problem.id}
                    prefetch={false}
                    href={`/problems/${problem.slug}`}
                    className={cn(
                      "group grid items-center gap-3 px-4 py-3 transition-colors duration-200 ease-out hover:bg-muted/50 sm:grid-cols-[2.5rem_minmax(0,1fr)_80px_70px]",
                      index !== contest.problems.length - 1 &&
                        "border-b border-border",
                    )}
                  >
                    <div className="flex size-8 items-center justify-center font-mono text-xs font-medium">
                      {problem.order}
                    </div>
                    <div className="min-w-0">
                      <p className="truncate text-sm font-medium transition-colors duration-200 ease-out group-hover:text-primary">
                        {problem.title}
                      </p>
                      <p className="mt-0.5 text-xs text-secondary">
                        {problem.points} points
                      </p>
                    </div>
                    <div className="text-xs font-medium tabular-nums text-secondary sm:text-right">
                      {problem.points} pts
                    </div>
                    <div
                      className={cn(
                        "text-xs font-medium sm:text-right",
                        difficultyClassName(problem.difficulty),
                      )}
                    >
                      {problem.difficulty}
                    </div>
                  </Link>
                ))}
              </div>
            ) : (
              <div className="nothing-card px-4 py-10 text-center text-sm text-disabled">
                No problems linked to this contest yet.
              </div>
            )}
          </section>

          <section id="leaderboard" className="space-y-3">
            <div className="flex items-center justify-between">
              <div>
                <p className="font-mono-label">Standings</p>
                <h2 className="text-base font-medium">
                  {isLive
                    ? "Live Leaderboard"
                    : isPast
                      ? "Final Standings"
                      : "Leaderboard"}
                </h2>
              </div>
              <p className="text-xs text-secondary">
                {isUpcoming
                  ? "Visible once the contest starts."
                  : "Score first, then penalty."}
              </p>
            </div>

            {isUpcoming ? (
              <div className="nothing-card p-8 text-center">
                <div className="mx-auto flex size-10 items-center justify-center">
                  <Lock size={18} className="text-secondary" />
                </div>
                <p className="mt-3 text-sm font-medium">Leaderboard Hidden</p>
                <p className="mt-1 text-xs text-secondary">
                  Unlocks once the contest starts.
                </p>
              </div>
            ) : contest.leaderboard.length > 0 ? (
              <div className="nothing-card overflow-hidden">
                <div className="grid grid-cols-[2.5rem_minmax(0,1fr)_4rem_4rem] gap-3 border-b border-border px-4 py-2.5 text-[11px] font-medium uppercase tracking-[0.06em] text-secondary">
                  <span className="text-center">Rank</span>
                  <span>Coder</span>
                  <span className="text-right">Score</span>
                  <span className="text-right">Penalty</span>
                </div>
                {contest.leaderboard.map((entry, index) => (
                  <Link
                    key={entry.username}
                    prefetch={false}
                    href={`/u/${entry.username}`}
                    className={cn(
                      "group grid grid-cols-[2.5rem_minmax(0,1fr)_4rem_4rem] items-center gap-3 px-4 py-2.5 text-sm transition-colors duration-200 ease-out hover:bg-muted/50",
                      index !== contest.leaderboard.length - 1 &&
                        "border-b border-border",
                    )}
                  >
                    <div className="flex justify-center">
                      <RankBadge rank={entry.rank} />
                    </div>
                    <span className="truncate font-medium text-secondary transition-colors duration-200 ease-out group-hover:text-primary">
                      {entry.username}
                    </span>
                    <span className="text-right font-mono text-xs tabular-nums">
                      {entry.score}
                    </span>
                    <span className="text-right font-mono text-xs tabular-nums text-secondary">
                      {entry.penalty}
                    </span>
                  </Link>
                ))}
              </div>
            ) : (
              <div className="nothing-card p-8 text-center text-sm text-disabled">
                Standings will appear once participants are scored.
              </div>
            )}
          </section>

          <section className="space-y-3">
            <div>
              <p className="font-mono-label">Format</p>
              <h2 className="text-base font-medium">Rules</h2>
            </div>

            <div className="nothing-card">
              {rules.map((rule, index) => (
                <div
                  key={rule}
                  className={cn(
                    "flex gap-3 px-4 py-3",
                    index !== rules.length - 1 && "border-b border-border",
                  )}
                >
                  <span className="mt-0.5 flex size-6 shrink-0 items-center justify-center font-mono text-[11px] font-medium text-secondary tabular-nums">
                    {index + 1}
                  </span>
                  <p className="text-sm leading-relaxed text-secondary">
                    {rule}
                  </p>
                </div>
              ))}
            </div>
          </section>
        </div>

        <aside className="space-y-4 lg:sticky lg:top-20 lg:self-start">
          <div className="nothing-card">
            <div className="border-b border-border px-4 py-3">
              <h3 className="text-sm font-medium">Contest Snapshot</h3>
            </div>
            <div className="space-y-0.5 p-3">
              {[
                {
                  label: "Problems",
                  value: `${contest.problemCount} linked`,
                  icon: FileText,
                  color: "text-primary",
                },
                {
                  label: "Scoring",
                  value: "Score, then penalty",
                  icon: Target,
                  color: "status-success",
                },
                {
                  label: "Status",
                  value: isLive
                    ? "Running now"
                    : isUpcoming
                      ? "Registration open"
                      : "Contest closed",
                  icon: Trophy,
                  color: "status-warning",
                },
              ].map((item) => (
                <div
                  key={item.label}
                  className="flex items-center gap-3 rounded px-3 py-2.5 transition-colors duration-200 ease-out hover:bg-muted/50"
                >
                  <div className="flex size-8 items-center justify-center font-mono">
                    <item.icon size={14} />
                  </div>
                  <div className="min-w-0 flex-1">
                    <p className="text-[11px] font-mono-label">{item.label}</p>
                    <p className="text-xs font-medium">{item.value}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>

          <div className="nothing-card p-4 text-sm text-secondary">
            <p>
              {isUpcoming
                ? "Register now to hold your spot before the round opens."
                : isLive
                  ? "The contest is active. Open the first problem and start submitting."
                  : "This round is closed, but the archive remains available for review."}
            </p>

            <div className="mt-3 flex flex-col gap-2">
              {isLive && (
                <Link
                  prefetch={false}
                  href={
                    primaryProblem
                      ? `/problems/${primaryProblem.slug}`
                      : "#problem-set"
                  }
                  className={cn(
                    buttonVariants({ size: "default" }),
                    "bg-primary text-primary-foreground hover:bg-primary/90",
                  )}
                >
                  {primaryProblem ? "Open first problem" : "Open contest"}
                </Link>
              )}

              {isPast && (
                <Link
                  prefetch={false}
                  href="#problem-set"
                  className={buttonVariants({ variant: "outline" })}
                >
                  Browse problem set
                </Link>
              )}
            </div>
          </div>
        </aside>
      </div>
    </div>
  );
}
