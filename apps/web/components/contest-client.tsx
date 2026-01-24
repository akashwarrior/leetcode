"use client";

import Link from "next/link";
import { cn } from "@/lib/utils";
import { useEffect, useMemo, useState } from "react";
import { buttonVariants } from "@/components/ui/button";
import { ContestCountdown } from "@/components/contest-countdown";
import { ContestRegistrationButton } from "@/components/contest-registration-button";
import {
  getContestDurationMinutes,
  getContestStatus,
  type ContestStatus,
} from "@/lib/contest";
import {
  CrownIcon,
  MedalIcon,
  ArrowRightIcon,
  CalendarIcon,
  ClockIcon,
  TrophyIcon,
  UsersIcon,
  FileTextIcon,
} from "@phosphor-icons/react";

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
  if (rank === 1)
    return <CrownIcon size={14} weight="regular" className="status-warning" />;
  if (rank === 2)
    return <MedalIcon size={14} weight="regular" className="text-secondary" />;
  if (rank === 3)
    return (
      <MedalIcon
        size={14}
        weight="regular"
        className="status-warning"
        style={{ opacity: 0.7 }}
      />
    );
  return (
    <span className="w-4 text-center font-mono text-xs text-disabled">
      {rank}
    </span>
  );
}

function StatusBadge({ status }: { status: ContestStatus }) {
  const className =
    status === "LIVE"
      ? "status-success"
      : status === "UPCOMING"
        ? "text-primary"
        : "text-disabled";

  return (
    <span
      className={cn(
        "inline-flex items-center gap-1.5 text-xs font-medium",
        className,
      )}
    >
      {status === "LIVE" ? (
        <span className="size-1.5 rounded-full bg-success" />
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
  const duration = getContestDurationMinutes(
    contest.startTime,
    contest.endTime,
  );
  const href = `/contests/${contest.slug}`;

  return (
    <article className="nothing-card nothing-card-hover p-4">
      <div className="flex items-start justify-between gap-4">
        <div className="min-w-0 flex-1">
          <div className="mb-2 flex items-center gap-2">
            <StatusBadge status={status} />
            {isRegistered && status !== "COMPLETED" && (
              <span className="status-success text-xs font-medium">
                Registered
              </span>
            )}
          </div>

          <Link
            prefetch={false}
            href={href}
            className="group inline-flex items-center gap-1.5 text-base font-medium tracking-tight hover:text-primary transition-colors duration-200 ease-out"
          >
            <span className="truncate">{contest.title}</span>
            <ArrowRightIcon
              size={14}
              weight="regular"
              className="text-disabled transition-all duration-200 ease-out group-hover:translate-x-0.5 group-hover:text-primary"
            />
          </Link>

          <div className="mt-2 flex flex-wrap gap-x-4 gap-y-1.5 text-xs text-secondary">
            <span className="flex items-center gap-1.5">
              <CalendarIcon size={12} weight="regular" className="text-disabled" />
              {contest.startLabel}
            </span>
            <span className="flex items-center gap-1.5">
              <ClockIcon size={12} weight="regular" className="text-disabled" />
              {duration}m
            </span>
            <span className="flex items-center gap-1.5">
              <FileTextIcon size={12} weight="regular" className="text-disabled" />
              {contest.problemCount}
            </span>
            <span className="flex items-center gap-1.5">
              <UsersIcon size={12} weight="regular" className="text-disabled" />
              {contest.participantCount.toLocaleString()}
            </span>
          </div>

          <p className="mt-2 text-xs text-secondary">
            {status === "UPCOMING" ? (
              <>
                Starts in{" "}
                <ContestCountdown
                  target={contest.startTime}
                  initialNow={now}
                  compact
                  className="text-xs font-medium text-primary"
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
                  className="text-xs font-medium text-primary"
                />
              </>
            ) : (
              "Results and problems remain available."
            )}
          </p>
        </div>

        <div className="flex shrink-0 flex-col items-end gap-2">
          {status === "UPCOMING" && (
            <ContestRegistrationButton
              contestSlug={contest.slug}
              contestTitle={contest.title}
              initialRegistered={isRegistered}
              size="sm"
            />
          )}
          <Link
            href={href}
            prefetch={false}
            className={cn(
              buttonVariants({
                variant: status === "LIVE" ? "default" : "outline",
              }),
              "w-24",
              status === "LIVE" &&
              "bg-primary text-primary-foreground hover:bg-primary/90",
            )}
          >
            {status === "LIVE"
              ? "Enter"
              : status === "UPCOMING"
                ? "Details"
                : "Results"}
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
    return [...contests].sort((left, right) => {
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
    if (filter === "ALL") return true;
    return getContestStatus(contest.startTime, contest.endTime, now) === filter;
  });

  return (
    <div className="pb-12">
      <div className="mb-8">
        <p className="font-mono-label mb-1">COMPETE</p>
        <h1 className="text-display text-3xl tracking-tighter">Contests</h1>
        <p className="mt-2 text-sm text-secondary max-w-md">
          Register for upcoming rounds, track live contests, and review
          completed standings.
        </p>
      </div>

      <div className="grid gap-6 lg:grid-cols-[minmax(0,1fr)_300px]">
        <div className="flex flex-col gap-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <h2 className="text-sm font-medium text-primary">Schedule</h2>
              <span className="rounded bg-muted px-1.5 py-0.5 font-mono text-[11px] text-secondary">
                {filteredContests.length}
              </span>
            </div>

            <div className="inline-flex items-center rounded-lg bg-muted p-0.5">
              {FILTERS.map((option) => (
                <button
                  key={option.id}
                  onClick={() => setFilter(option.id)}
                  className={cn(
                    "inline-flex h-7 items-center px-2.5 text-xs font-medium rounded-md transition-colors duration-200 ease-out",
                    filter !== option.id
                      ? "text-secondary hover:text-primary"
                      : "bg-background text-primary",
                  )}
                >
                  {option.label}
                </button>
              ))}
            </div>
          </div>

          {filteredContests.length > 0 ? (
            <div className="flex flex-col gap-2">
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
            <div className="nothing-card p-12 text-center">
              <p className="text-sm text-secondary">
                No contests match the selected filter.
              </p>
            </div>
          )}
        </div>

        <div className="flex flex-col gap-4">
          <div className="nothing-card p-4">
            <div className="mb-3 flex items-center gap-2">
              <TrophyIcon size={14} weight="regular" className="status-warning" />
              <h2 className="text-sm font-medium text-primary">Top Rated</h2>
            </div>

            <div className="flex flex-col gap-0.5">
              {topUsers.map((user, index) => (
                <Link
                  key={user.username}
                  prefetch={false}
                  href={`/u/${user.username}`}
                  className="group flex items-center gap-2.5 rounded px-2 py-1.5 transition-colors duration-200 ease-out hover:bg-muted/50"
                >
                  <div className="flex w-4 justify-center">
                    <RankBadge rank={index + 1} />
                  </div>
                  <div className="min-w-0 flex-1">
                    <p className="truncate text-sm font-medium group-hover:text-primary transition-colors duration-200 ease-out">
                      {user.username}
                    </p>
                    <p className="text-xs text-secondary">
                      {user.globalRank ? `#${user.globalRank}` : "Unranked"}
                    </p>
                  </div>
                  <span className="font-mono text-xs tabular-nums text-secondary">
                    {user.rating}
                  </span>
                </Link>
              ))}
            </div>
          </div>

          <div className="nothing-card p-4">
            <h2 className="mb-3 text-sm font-medium text-primary">
              Your Snapshot
            </h2>

            {myStats ? (
              <div className="flex flex-col gap-3">
                <div>
                  <p className="text-sm font-medium text-primary">
                    {myStats.username}
                  </p>
                  <p className="text-xs text-secondary">
                    {myStats.globalRank
                      ? `#${myStats.globalRank}`
                      : "Rank pending"}
                  </p>
                </div>

                <div className="grid grid-cols-2 gap-2">
                  {[
                    { label: "Rating", value: myStats.rating },
                    { label: "Solved", value: myStats.solvedTotal },
                    { label: "Attended", value: myStats.attended },
                    { label: "Streak", value: `${myStats.streak}d` },
                  ].map((item) => (
                    <div key={item.label} className="rounded bg-muted/50 p-2.5">
                      <p className="text-[11px] text-secondary">{item.label}</p>
                      <p className="mt-0.5 text-sm font-medium tabular-nums text-primary">
                        {item.value}
                      </p>
                    </div>
                  ))}
                </div>

                <Link
                  prefetch={false}
                  href={`/u/${myStats.username}`}
                  className={cn(
                    buttonVariants({ variant: "outline", size: "sm" }),
                    "w-full",
                  )}
                >
                  View profile
                </Link>
              </div>
            ) : (
              <div className="flex flex-col gap-3">
                <p className="text-sm text-secondary">
                  Sign in to register for contests and track your participation.
                </p>
                <Link
                  prefetch={false}
                  href="/sign-in"
                  className={cn(
                    buttonVariants({ size: "sm" }),
                    "bg-primary text-primary-foreground hover:bg-primary/90 w-full",
                  )}
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
