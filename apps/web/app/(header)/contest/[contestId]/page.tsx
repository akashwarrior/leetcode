"use client";

import { useEffect, useState } from "react";
import { notFound } from "next/navigation";
import Link from "next/link";
import { use } from "react";
import { useAtom } from "jotai";
import { registeredContestsAtom } from "@/lib/store";
import { CONTESTS, CONTEST_LEADERBOARD } from "@/lib/dummy-data";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { toast } from "sonner";
import {
  ArrowLeft,
  CalendarClock,
  Timer,
  Users,
  FileText,
  CheckCircle2,
  Clock,
  Trophy,
  Zap,
  Medal,
  Crown,
  Target,
  BarChart3,
  Lock,
} from "lucide-react";

function InlineCountdown({ target }: { target: Date }) {
  const [now, setNow] = useState(new Date());

  useEffect(() => {
    const id = setInterval(() => setNow(new Date()), 1000);
    return () => clearInterval(id);
  }, []);

  const diff = Math.max(0, target.getTime() - now.getTime());
  const d = Math.floor(diff / 86400000);
  const h = Math.floor((diff % 86400000) / 3600000);
  const m = Math.floor((diff % 3600000) / 60000);
  const s = Math.floor((diff % 60000) / 1000);

  if (diff === 0)
    return <span className="text-emerald-500 font-medium">Live now</span>;
  return (
    <span className="font-mono text-lg font-medium tabular-nums">
      {d > 0 && `${d}d `}
      {h}h {String(m).padStart(2, "0")}m {String(s).padStart(2, "0")}s
    </span>
  );
}

function RankBadge({ rank }: { rank: number }) {
  if (rank === 1) return <Crown size={14} className="text-amber-500" />;
  if (rank === 2) return <Medal size={14} className="text-slate-400" />;
  if (rank === 3) return <Medal size={14} className="text-amber-700" />;
  return (
    <span className="text-xs text-muted-foreground font-mono w-4 text-center">
      {rank}
    </span>
  );
}

const RULES = [
  "The contest consists of 4 algorithmic problems to solve within the time limit.",
  "Problems are ordered by difficulty from easiest to hardest.",
  "Solutions are scored based on correctness, with penalties for wrong submissions.",
  "The earlier you solve a problem, the better your ranking.",
  "You may submit as many times as you want for each problem.",
  "All standard languages are supported: JavaScript, Python, C++, Java, Go.",
];

export default function ContestDetailPage({
  params,
}: {
  params: Promise<{ contestId: string }>;
}) {
  const { contestId } = use(params);
  const contest = CONTESTS.find((c) => c.id === contestId);
  const [registeredContests, setRegisteredContests] = useAtom(registeredContestsAtom);

  if (!contest) return notFound();

  const now = new Date();
  const start = new Date(contest.startTime);
  const end = new Date(contest.endTime);
  const duration = Math.round((end.getTime() - start.getTime()) / 60000);

  const isUpcoming = start > now;
  const isLive = start <= now && end > now;
  const isPast = end <= now;
  const isRegistered = registeredContests.has(contestId);

  const status = isLive ? "Live" : isUpcoming ? "Upcoming" : "Completed";
  const statusConfig = {
    Live: { bg: "bg-emerald-500/10", text: "text-emerald-500", dot: true },
    Upcoming: { bg: "bg-primary/10", text: "text-primary", dot: false },
    Completed: { bg: "bg-muted", text: "text-muted-foreground", dot: false },
  };
  const statusStyle = statusConfig[status as keyof typeof statusConfig];

  function handleRegister() {
    setRegisteredContests((prev) => {
      const next = new Set(prev);
      if (next.has(contestId)) {
        next.delete(contestId);
        toast.success("Registration cancelled");
      } else {
        next.add(contestId);
        toast.success(`Registered for ${contest!.name}`, {
          description: "You'll receive a reminder before the contest starts.",
        });
      }
      return next;
    });
  }

  return (
    <div className="pb-10">
      <Link
        href="/contest"
        className="inline-flex items-center gap-2 text-sm text-muted-foreground hover:text-foreground transition-colors mb-6"
      >
        <ArrowLeft size={14} />
        All Contests
      </Link>

      {/* Header card */}
      <div className="surface-card rounded-xl overflow-hidden mb-6">
        <div className="p-5 sm:p-6">
          <div className="flex items-start justify-between mb-3">
            <div>
              <div className="flex items-center gap-2 mb-2">
                <span
                  className={cn(
                    "inline-flex items-center gap-1.5 rounded-md px-2 py-0.5 text-xs font-medium",
                    statusStyle.bg,
                    statusStyle.text,
                  )}
                >
                  {statusStyle.dot && (
                    <span className="size-1.5 rounded-full bg-emerald-500 pulse-live" />
                  )}
                  {status}
                </span>
              </div>
              <h1 className="text-xl font-medium">{contest.name}</h1>
            </div>
            {(isUpcoming || isLive) && (
              <Button
                onClick={handleRegister}
                className={cn(
                  "h-9 rounded-md text-sm font-medium px-5 gap-2",
                  isRegistered
                    ? "bg-muted text-foreground hover:bg-muted/80 border border-border"
                    : "gradient-primary text-white border-0",
                )}
              >
                {isRegistered ? (
                  <>
                    <CheckCircle2 size={14} /> Registered
                  </>
                ) : (
                  <>
                    <Trophy size={14} /> Register
                  </>
                )}
              </Button>
            )}
          </div>

          <div className="flex flex-wrap items-center gap-x-5 gap-y-2 text-sm text-muted-foreground">
            <span className="flex items-center gap-1.5">
              <CalendarClock size={14} className="text-muted-foreground/50" />
              {start.toLocaleDateString("en-US", {
                weekday: "long",
                month: "long",
                day: "numeric",
                year: "numeric",
              })}
            </span>
            <span className="flex items-center gap-1.5">
              <Timer size={14} className="text-muted-foreground/50" />
              {duration} minutes
            </span>
            <span className="flex items-center gap-1.5">
              <Zap size={14} className="text-muted-foreground/50" />
              {contest.problemCount} problems
            </span>
            <span className="flex items-center gap-1.5">
              <Users size={14} className="text-muted-foreground/50" />
              {contest.participantCount > 0
                ? contest.participantCount.toLocaleString() + " participants"
                : "Registration open"}
            </span>
          </div>
        </div>

        {isUpcoming && (
          <div className="border-t border-border p-5 sm:p-6 bg-muted/20">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
              <div className="flex items-center gap-3">
                <div className="flex size-10 items-center justify-center rounded-lg bg-primary/10">
                  <Clock size={18} className="text-primary" />
                </div>
                <div>
                  <p className="text-xs text-muted-foreground mb-0.5">Starts in</p>
                  <InlineCountdown target={start} />
                </div>
              </div>
              {isRegistered && (
                <div className="flex items-center gap-2 text-xs text-emerald-500">
                  <CheckCircle2 size={14} />
                  <span>You are registered for this contest</span>
                </div>
              )}
            </div>
          </div>
        )}

        {isLive && (
          <div className="border-t border-border p-5 sm:p-6 bg-emerald-500/5">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
              <div className="flex items-center gap-2 text-sm">
                <span className="size-2 rounded-full bg-emerald-500 pulse-live" />
                <span className="text-muted-foreground">Contest is in progress</span>
                <span className="text-xs text-muted-foreground/50 ml-2">
                  Ends in <InlineCountdown target={end} />
                </span>
              </div>
              <Button className="h-9 rounded-md gradient-primary border-0 text-white text-sm font-medium px-5 gap-2">
                Enter Contest <Trophy size={14} />
              </Button>
            </div>
          </div>
        )}

        {isPast && (
          <div className="border-t border-border p-5 sm:p-6">
            <div className="flex flex-wrap gap-2">
              <Button variant="outline" className="h-9 rounded-md font-medium text-sm">
                View Problems
              </Button>
              <Button variant="outline" className="h-9 rounded-md font-medium text-sm">
                View Rankings
              </Button>
              <Button variant="outline" className="h-9 rounded-md font-medium text-sm">
                Editorials
              </Button>
            </div>
          </div>
        )}
      </div>

      <div className="grid gap-6 lg:grid-cols-[2fr_1fr]">
        <div className="space-y-6">
          {/* Leaderboard — only for live/past contests */}
          {(isLive || isPast) && (
            <div className="surface-card rounded-xl overflow-hidden">
              <div className="px-5 py-4 border-b border-border">
                <div className="flex items-center gap-2">
                  <Trophy size={14} className="text-amber-500" />
                  <span className="text-sm font-medium">
                    {isLive ? "Live Leaderboard" : "Final Standings"}
                  </span>
                </div>
              </div>
              <div className="grid grid-cols-[2.5rem_1fr_3.5rem_3.5rem] gap-4 px-4 py-2.5 text-xs text-muted-foreground border-b border-border bg-muted/30">
                <span className="text-center">#</span>
                <span>User</span>
                <span className="text-right">Score</span>
                <span className="text-right">Time</span>
              </div>
              {CONTEST_LEADERBOARD.map((entry) => (
                <Link
                  key={entry.rank}
                  href={`/u/${entry.user}`}
                  className="group grid grid-cols-[2.5rem_1fr_3.5rem_3.5rem] gap-4 px-4 py-3 text-sm items-center hover:bg-muted/30 transition-colors border-b border-border last:border-0"
                >
                  <div className="flex justify-center">
                    <RankBadge rank={entry.rank} />
                  </div>
                  <span className="font-medium text-muted-foreground group-hover:text-primary transition-colors truncate">
                    {entry.user}
                  </span>
                  <span className="text-right font-mono text-sm tabular-nums">
                    {entry.score}
                  </span>
                  <span className="text-right text-xs text-muted-foreground font-mono tabular-nums">
                    {entry.penalty}
                  </span>
                </Link>
              ))}
            </div>
          )}

          {/* For upcoming — show a locked state message */}
          {isUpcoming && (
            <div className="surface-card rounded-xl p-6">
              <div className="flex flex-col items-center justify-center text-center py-4 gap-3">
                <div className="flex size-12 items-center justify-center rounded-xl bg-muted">
                  <Lock size={20} className="text-muted-foreground" />
                </div>
                <div>
                  <p className="text-sm font-medium">Leaderboard Hidden</p>
                  <p className="text-xs text-muted-foreground mt-1 max-w-xs">
                    The leaderboard and problems will be visible once the contest starts.
                  </p>
                </div>
              </div>
            </div>
          )}

          {/* Rules */}
          <div className="surface-card rounded-xl p-5">
            <div className="flex items-center gap-2 mb-4">
              <FileText size={14} className="text-muted-foreground" />
              <span className="text-sm font-medium">Rules</span>
            </div>
            <ol className="space-y-3">
              {RULES.map((rule, i) => (
                <li
                  key={i}
                  className="flex gap-3 text-sm text-muted-foreground leading-relaxed"
                >
                  <span className="flex size-5 items-center justify-center rounded bg-muted text-xs text-muted-foreground mt-0.5 shrink-0 tabular-nums">
                    {i + 1}
                  </span>
                  {rule}
                </li>
              ))}
            </ol>
          </div>
        </div>

        <div className="space-y-5">
          {/* Contest details */}
          <div className="surface-card rounded-xl p-5">
            <h3 className="text-sm font-medium mb-4">Contest Details</h3>
            <div className="space-y-3">
              {[
                {
                  label: "Duration",
                  value: `${duration} minutes`,
                  icon: Timer,
                  color: "text-amber-500",
                },
                {
                  label: "Problems",
                  value: `${contest.problemCount} problems`,
                  icon: Zap,
                  color: "text-primary",
                },
                {
                  label: "Scoring",
                  value: "Penalty-based",
                  icon: Target,
                  color: "text-emerald-500",
                },
                {
                  label: "Rating",
                  value: "±25 points",
                  icon: BarChart3,
                  color: "text-violet-500",
                },
              ].map((info) => (
                <div key={info.label} className="flex items-center gap-3">
                  <div
                    className={cn(
                      "flex size-9 items-center justify-center rounded-lg bg-muted",
                      info.color,
                    )}
                  >
                    <info.icon size={16} />
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-xs text-muted-foreground">{info.label}</p>
                    <p className="text-sm font-medium">{info.value}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Problem set — only for live/past */}
          {(isLive || isPast) && (
            <div className="surface-card rounded-xl p-5">
              <h3 className="text-sm font-medium mb-3">Problem Set</h3>
              <div className="space-y-2">
                {Array.from({ length: contest.problemCount || 4 }, (_, i) => (
                  <div
                    key={i}
                    className="flex items-center gap-3 p-2 rounded-lg bg-muted/30 hover:bg-muted/50 transition-colors cursor-pointer"
                  >
                    <span className="flex size-6 items-center justify-center rounded bg-muted text-xs font-medium shrink-0">
                      {String.fromCharCode(65 + i)}
                    </span>
                    <div className="flex-1 min-w-0">
                      <p className="text-sm text-muted-foreground">
                        Problem {String.fromCharCode(65 + i)}
                      </p>
                    </div>
                    <span
                      className={cn(
                        "text-xs shrink-0",
                        i === 0 && "text-emerald-500",
                        i === 1 && "text-emerald-500",
                        i === 2 && "text-amber-500",
                        i === 3 && "text-rose-500",
                      )}
                    >
                      {i < 2 ? "Easy" : i === 2 ? "Medium" : "Hard"}
                    </span>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* For upcoming — locked problems */}
          {isUpcoming && (
            <div className="surface-card rounded-xl p-5">
              <div className="flex items-center gap-2 mb-3">
                <h3 className="text-sm font-medium">Problem Set</h3>
              </div>
              <div className="space-y-2">
                {Array.from({ length: contest.problemCount || 4 }, (_, i) => (
                  <div
                    key={i}
                    className="flex items-center gap-3 p-2 rounded-lg bg-muted/20"
                  >
                    <span className="flex size-6 items-center justify-center rounded bg-muted text-xs font-medium shrink-0 text-muted-foreground/30">
                      {String.fromCharCode(65 + i)}
                    </span>
                    <div className="flex-1 h-3 rounded-full bg-muted/50" />
                    <Lock size={12} className="text-muted-foreground/20 shrink-0" />
                  </div>
                ))}
              </div>
              <p className="text-[10px] text-muted-foreground/50 mt-3 text-center">
                Problems revealed when contest starts
              </p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
