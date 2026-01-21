"use client";

import Link from "next/link";
import { cn } from "@/lib/utils";
import { useEffect, useMemo, useState } from "react";
import { buttonVariants } from "@/components/ui/button";
import { ContestCountdown } from "@/components/contest-countdown";
import { AnimatedBackground } from "@/components/ui/animated-background";
import { ContestRegistrationButton } from "@/components/contest-registration-button";
import {
  getContestDurationMinutes,
  getContestStatus,
  type ContestStatus,
} from "@/lib/contest";
import {
  Crown,
  Medal,
  ArrowRight,
  CalendarClock,
  Timer,
  Trophy,
  Users,
  Zap,
} from "lucide-react";

type ContestListItem = {
  id: string;
  slug: string;
  title: string;
  startTime: string;
  endTime: string;
  startLabel: string;
  problemCount: number;
  participantCount: number;
};

type TopUser = {
  username: string;
  rating: number;
  globalRank: number | null;
};

type MyStats = {
  username: string;
  globalRank: number | null;
  rating: number;
  streak: number;
  solvedTotal: number;
  attended: number;
};

type ContestClientProps = {
  contests: ContestListItem[];
  topUsers: TopUser[];
  myStats: MyStats | null;
  registeredContestIds: string[];
};

type FilterValue = "ALL" | ContestStatus;

const FILTERS: { id: FilterValue; label: string }[] = [
  { id: "ALL", label: "All" },
  { id: "LIVE", label: "Live" },
  { id: "UPCOMING", label: "Upcoming" },
  { id: "COMPLETED", label: "Completed" },
];

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

function StatusBadge({ status }: { status: ContestStatus }) {
  const style =
    status === "LIVE"
      ? "bg-emerald-500/10 text-emerald-500"
      : status === "UPCOMING"
        ? "bg-primary/10 text-primary"
        : "bg-muted text-muted-foreground";

  return (
    <span
      className={cn(
        "inline-flex items-center gap-1.5 rounded-md px-2 py-1 text-[11px] font-medium",
        style,
      )}
    >
      {status === "LIVE" ? (
        <span className="size-1.5 rounded-full bg-emerald-500 animate-pulse" />
      ) : null}
      {status === "LIVE"
        ? "Live"
        : status === "UPCOMING"
          ? "Upcoming"
          : "Completed"}
    </span>
  );
}

function ContestCard({
  contest,
  isRegistered,
  now,
}: {
  contest: ContestListItem;
  isRegistered: boolean;
  now: Date;
}) {
  const status = getContestStatus(contest.startTime, contest.endTime, now);
  const duration = getContestDurationMinutes(contest.startTime, contest.endTime);
  const href = `/contest/${contest.slug}`;

  return (
    <article className="surface-card rounded-xl p-5 transition-colors duration-150 hover:border-foreground/10">
      <div className="flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
        <div className="min-w-0">
          <div className="mb-3 flex flex-wrap items-center gap-2">
            <StatusBadge status={status} />
            {isRegistered && status !== "COMPLETED" ? (
              <span className="rounded-md bg-emerald-500/10 px-2 py-1 text-[11px] font-medium text-emerald-500">
                Registered
              </span>
            ) : null}
          </div>

          <Link
            prefetch={false}
            href={href}
            className="group inline-flex items-center gap-2 text-lg font-medium tracking-tight hover:text-primary transition-colors"
          >
            <span className="truncate">{contest.title}</span>
            <ArrowRight size={14} className="text-muted-foreground transition-transform group-hover:translate-x-0.5 group-hover:text-primary" />
          </Link>

          <div className="mt-3 grid gap-2 text-sm text-muted-foreground sm:grid-cols-2">
            <span className="flex items-center gap-2">
              <CalendarClock size={14} className="text-muted-foreground/60" />
              {contest.startLabel}
            </span>
            <span className="flex items-center gap-2">
              <Timer size={14} className="text-muted-foreground/60" />
              {duration} minutes
            </span>
            <span className="flex items-center gap-2">
              <Zap size={14} className="text-muted-foreground/60" />
              {contest.problemCount} problems
            </span>
            <span className="flex items-center gap-2">
              <Users size={14} className="text-muted-foreground/60" />
              {contest.participantCount.toLocaleString()} participants
            </span>
          </div>

          <p className="mt-3 text-sm text-muted-foreground">
            {status === "UPCOMING" ? (
              <>
                Starts in{" "}
                <ContestCountdown
                  target={contest.startTime}
                  initialNow={now}
                  compact
                  className="text-sm font-medium text-foreground"
                />
              </>
            ) : status === "LIVE" ? (
              <>
                Ends in{" "}
                <ContestCountdown
                  target={contest.endTime}
                  initialNow={now}
                  compact
                  expiredLabel="Finalizing"
                  className="text-sm font-medium text-foreground"
                />
              </>
            ) : (
              "Results and linked problems remain available after the contest ends."
            )}
          </p>
        </div>

        <div className="flex shrink-0 flex-wrap items-center gap-2">
          {status === "UPCOMING" ? (
            <ContestRegistrationButton
              contestId={contest.id}
              contestTitle={contest.title}
              initialRegistered={isRegistered}
              size="sm"
            />
          ) : null}

          <Link
            prefetch={false}
            href={href}
            className={cn(
              buttonVariants({
                variant: status === "LIVE" ? "default" : "outline",
                size: "sm",
              }),
              status === "LIVE" && "gradient-primary border-0 text-white",
            )}
          >
            {status === "LIVE"
              ? "Enter contest"
              : status === "UPCOMING"
                ? "View details"
                : "View results"}
          </Link>
        </div>
      </div>
    </article>
  );
}

export function ContestClient({
  contests,
  topUsers,
  myStats,
  registeredContestIds,
}: ContestClientProps) {
  const [filter, setFilter] = useState<FilterValue>("ALL");
  const [now, setNow] = useState(() => new Date());

  useEffect(() => {
    const interval = setInterval(() => setNow(new Date()), 1000);

    return () => clearInterval(interval);
  }, []);

  const registeredIds = useMemo(
    () => new Set(registeredContestIds),
    [registeredContestIds],
  );

  const orderedContests = useMemo(() => {
    return contests.sort((left, right) => {
      const leftStatus = getContestStatus(left.startTime, left.endTime, now);
      const rightStatus = getContestStatus(right.startTime, right.endTime, now);

      const statusOrder: Record<ContestStatus, number> = {
        LIVE: 0,
        UPCOMING: 1,
        COMPLETED: 2,
      };

      if (leftStatus !== rightStatus) {
        return statusOrder[leftStatus] - statusOrder[rightStatus];
      }

      const leftStart = new Date(left.startTime).getTime();
      const rightStart = new Date(right.startTime).getTime();

      if (leftStatus === "COMPLETED") {
        return rightStart - leftStart;
      }

      return leftStart - rightStart;
    });
  }, [contests, now]);

  const filteredContests = orderedContests.filter((contest) => {
    if (filter === "ALL") {
      return true;
    }

    return getContestStatus(contest.startTime, contest.endTime, now) === filter;
  });

  return (
    <div className="pb-12 space-y-6">
      <div>
        <div>
          <h1 className="text-xl font-medium tracking-tight">Contests</h1>
          <p className="mt-1 text-sm text-muted-foreground">
            Register for upcoming rounds, track live contests, and review completed standings.
          </p>
        </div>
      </div>

      <div className="grid gap-6 lg:grid-cols-[minmax(0,1fr)_320px]">
        <div className="space-y-4">
          <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
            <div className="flex items-center gap-2">
              <h2 className="text-sm font-medium">Schedule</h2>
              <span className="rounded-md bg-muted px-2 py-0.5 font-mono text-[11px] text-muted-foreground">
                {filteredContests.length}
              </span>
            </div>

            <div className="flex items-center rounded-lg border border-border bg-card p-0.5">
              <AnimatedBackground
                defaultValue={filter}
                onValueChange={(value) => setFilter(value as FilterValue)}
                className="rounded-md bg-muted"
                transition={{ ease: "easeInOut", duration: 0.15 }}
              >
                {FILTERS.map((option) => (
                  <button
                    key={option.id}
                    data-id={option.id}
                    className={cn(
                      "inline-flex h-7 items-center rounded-md px-3 text-xs font-medium transition-colors",
                      filter !== option.id &&
                      "text-muted-foreground hover:text-foreground",
                    )}
                  >
                    {option.label}
                  </button>
                ))}
              </AnimatedBackground>
            </div>
          </div>

          {filteredContests.length > 0 ? (
            <div className="space-y-3">
              {filteredContests.map((contest) => (
                <ContestCard
                  key={contest.id}
                  contest={contest}
                  isRegistered={registeredIds.has(contest.id)}
                  now={now}
                />
              ))}
            </div>
          ) : (
            <div className="surface-card rounded-xl p-12 text-center">
              <p className="text-sm text-muted-foreground">
                No contests match the selected filter.
              </p>
            </div>
          )}
        </div>

        <div className="space-y-5">
          <div className="surface-card rounded-xl p-5">
            <div className="mb-4 flex items-center gap-2">
              <Trophy size={14} className="text-amber-500" />
              <h2 className="text-sm font-medium">Top Rated</h2>
            </div>

            <div className="space-y-1">
              {topUsers.map((user, index) => (
                <Link
                  key={user.username}
                  prefetch={false}
                  href={`/u/${user.username}`}
                  className="group flex items-center gap-3 rounded-lg px-2 py-2 transition-colors hover:bg-muted/40"
                >
                  <div className="flex w-4 justify-center">
                    <RankBadge rank={index + 1} />
                  </div>
                  <div className="min-w-0 flex-1">
                    <p className="truncate text-sm font-medium group-hover:text-primary transition-colors">
                      {user.username}
                    </p>
                    <p className="text-xs text-muted-foreground">
                      {user.globalRank ? `Global #${user.globalRank}` : "Unranked"}
                    </p>
                  </div>
                  <span className="font-mono text-xs text-muted-foreground">
                    {user.rating}
                  </span>
                </Link>
              ))}
            </div>
          </div>

          <div className="surface-card rounded-xl p-5">
            <h2 className="mb-4 text-sm font-medium">Your Snapshot</h2>

            {myStats ? (
              <div className="space-y-4">
                <div>
                  <p className="text-sm font-medium">{myStats.username}</p>
                  <p className="text-xs text-muted-foreground">
                    {myStats.globalRank ? `Global #${myStats.globalRank}` : "Global rank pending"}
                  </p>
                </div>

                <div className="grid grid-cols-2 gap-3">
                  {[
                    { label: "Rating", value: myStats.rating },
                    { label: "Solved", value: myStats.solvedTotal },
                    { label: "Attended", value: myStats.attended },
                    { label: "Streak", value: `${myStats.streak}d` },
                  ].map((item) => (
                    <div key={item.label} className="rounded-lg bg-muted/40 p-3">
                      <p className="text-[11px] text-muted-foreground">{item.label}</p>
                      <p className="mt-1 text-base font-medium tabular-nums">
                        {item.value}
                      </p>
                    </div>
                  ))}
                </div>

                <Link
                  prefetch={false}
                  href={`/u/${myStats.username}`}
                  className={cn(buttonVariants({ variant: "outline", size: "sm" }), "w-full")}
                >
                  View profile
                </Link>
              </div>
            ) : (
              <div className="space-y-3">
                <p className="text-sm text-muted-foreground">
                  Sign in to register for contests and track your participation history.
                </p>
                <Link
                  prefetch={false}
                  href="/sign-in"
                  className={cn(buttonVariants({ size: "sm" }), "gradient-primary w-full border-0 text-white")}
                >
                  Sign in
                </Link>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
