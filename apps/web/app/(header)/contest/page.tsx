"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useAtom } from "jotai";
import { registeredContestsAtom } from "@/lib/store";
import { Button } from "@/components/ui/button";
import { CONTESTS, CONTEST_LEADERBOARD, CURRENT_USER } from "@/lib/dummy-data";
import {
  CalendarClock,
  Clock,
  Trophy,
  Zap,
  Users,
  ArrowRightIcon,
  Medal,
  Target,
  TrendingUp,
  Crown,
  Star,
  CheckCircle2,
} from "lucide-react";
import { cn } from "@/lib/utils";
import { toast } from "sonner";

function getDurationMin(c: (typeof CONTESTS)[0]) {
  return Math.round(
    (new Date(c.endTime).getTime() - new Date(c.startTime).getTime()) / 60000,
  );
}

function LiveCountdown({ target }: { target: Date }) {
  const [now, setNow] = useState(new Date());

  useEffect(() => {
    const id = setInterval(() => setNow(new Date()), 1000);
    return () => clearInterval(id);
  }, []);

  const diff = Math.max(0, target.getTime() - now.getTime());

  if (diff === 0) {
    return (
      <span className="text-emerald-500 text-sm font-medium flex items-center gap-2">
        <span className="size-1.5 rounded-full bg-emerald-500 pulse-live" />
        Live now
      </span>
    );
  }

  const d = Math.floor(diff / 86400000);
  const h = Math.floor((diff % 86400000) / 3600000);
  const m = Math.floor((diff % 3600000) / 60000);
  const s = Math.floor((diff % 60000) / 1000);

  const parts = [
    ...(d > 0 ? [{ value: String(d), label: "d" }] : []),
    { value: String(h), label: "h" },
    { value: String(m).padStart(2, "0"), label: "m" },
    { value: String(s).padStart(2, "0"), label: "s" },
  ];

  return (
    <div className="flex items-center gap-0.5 font-mono text-base font-medium">
      {parts.map((p, i) => (
        <span key={i} className="flex items-center">
          <span className="tabular-nums">{p.value}</span>
          <span className="text-muted-foreground text-xs ml-0.5">{p.label}</span>
          {i < parts.length - 1 && (
            <span className="text-muted-foreground/20 mx-1">:</span>
          )}
        </span>
      ))}
    </div>
  );
}

function RankBadge({ rank }: { rank: number }) {
  if (rank === 1) return <Crown size={14} className="text-amber-500" />;
  if (rank === 2) return <Medal size={14} className="text-slate-400" />;
  if (rank === 3) return <Medal size={14} className="text-amber-700" />;
  return (
    <span className="text-xs text-muted-foreground font-mono w-4 text-center tabular-nums">
      {rank}
    </span>
  );
}


export default function ContestPage() {
  const now = new Date();
  const upcoming = CONTESTS.filter((c) => new Date(c.startTime) > now);
  const past = CONTESTS.filter((c) => new Date(c.endTime) <= now);
  const featured = upcoming[0];
  const moreUpcoming = upcoming.slice(1);
  const router = useRouter();
  const [registeredContests, setRegisteredContests] = useAtom(registeredContestsAtom);

  function handleRegister(contestId: string, contestName: string, e: React.MouseEvent) {
    e.preventDefault();
    e.stopPropagation();
    setRegisteredContests((prev) => {
      const next = new Set(prev);
      if (next.has(contestId)) {
        next.delete(contestId);
        toast.success("Registration cancelled");
      } else {
        next.add(contestId);
        toast.success(`Registered for ${contestName}`);
      }
      return next;
    });
  }

  return (
    <div className="pb-10">
      <div className="mb-6">
        <h1 className="text-xl font-medium tracking-tight">Contests</h1>
        <p className="text-sm text-muted-foreground mt-0.5">
          Compete, improve, and climb the ranks
        </p>
      </div>

      {featured && (
        <Link
          href={`/contest/${featured.id}`}
          className="block surface-card rounded-xl p-6 mb-6 hover:border-foreground/10 dark:hover:border-white/12 transition-colors duration-150 group"
        >
          <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-5">
            <div className="flex-1">
              <div className="flex items-center gap-2 mb-2">
                <span className="size-1.5 rounded-full bg-primary/60 pulse-live" />
                <span className="text-xs text-muted-foreground">Next Contest</span>
                <span className="text-xs text-muted-foreground/40 ml-2 tabular-nums">
                  {featured.participantCount > 0
                    ? `${featured.participantCount.toLocaleString()} registered`
                    : "Registration open"}
                </span>
              </div>
              <h2 className="text-lg font-medium tracking-tight mb-3 group-hover:text-primary transition-colors">
                {featured.name}
              </h2>
              <div className="flex flex-wrap items-center gap-4 text-sm text-muted-foreground">
                <span className="flex items-center gap-1.5">
                  <CalendarClock size={14} />
                  {new Date(featured.startTime).toLocaleDateString("en-US", {
                    weekday: "long",
                    month: "long",
                    day: "numeric",
                  })}
                </span>
                <span className="flex items-center gap-1.5">
                  <Clock size={14} />
                  {getDurationMin(featured)} min
                </span>
                <span className="flex items-center gap-1.5">
                  <Zap size={14} />
                  {featured.problemCount} problems
                </span>
              </div>
            </div>
            <div className="flex items-center gap-5">
              <div>
                <p className="text-xs text-muted-foreground mb-1">Starts in</p>
                <LiveCountdown target={new Date(featured.startTime)} />
              </div>
              <Button
                className={cn(
                  "h-9 rounded-lg text-sm font-medium px-5 gap-2",
                  registeredContests.has(featured.id)
                    ? "bg-muted text-foreground hover:bg-muted/80 border border-border"
                    : "gradient-primary border-0 text-white"
                )}
                onClick={(e) => handleRegister(featured.id, featured.name, e)}
              >
                {registeredContests.has(featured.id) ? (
                  <>
                    <CheckCircle2 size={14} />
                    Registered
                  </>
                ) : (
                  "Register"
                )}
              </Button>
            </div>
          </div>
        </Link>
      )}

      <div className="grid gap-6 lg:grid-cols-[2fr_1fr]">
        <div className="space-y-6">
          {moreUpcoming.length > 0 && (
            <div>
              <p className="section-label mb-2">More Upcoming</p>
              <div className="surface-card rounded-xl overflow-hidden">
                {moreUpcoming.map((c) => (
                  <Link
                    key={c.id}
                    href={`/contest/${c.id}`}
                    className="flex items-center justify-between gap-3 px-4 py-3.5 hover:bg-muted/30 dark:hover:bg-white/[0.03] transition-colors group border-b border-border last:border-0"
                  >
                    <div className="flex items-center gap-3">
                      <div className="flex size-9 items-center justify-center rounded-lg bg-primary/10">
                        <CalendarClock size={15} className="text-primary" />
                      </div>
                      <div>
                        <p className="text-sm font-medium group-hover:text-primary transition-colors">
                          {c.name}
                        </p>
                        <p className="text-xs text-muted-foreground mt-0.5">
                          {new Date(c.startTime).toLocaleDateString("en-US", {
                            weekday: "short",
                            month: "short",
                            day: "numeric",
                          })}
                          <span className="mx-1.5 text-muted-foreground/30">·</span>
                          {getDurationMin(c)} min · {c.problemCount} problems
                        </p>
                      </div>
                    </div>
                    <Button
                      size="sm"
                      variant={registeredContests.has(c.id) ? "outline" : "outline"}
                      className={cn(
                        "h-7 rounded-md text-xs shrink-0",
                        registeredContests.has(c.id) && "text-emerald-500 border-emerald-500/30"
                      )}
                      onClick={(e) => handleRegister(c.id, c.name, e)}
                    >
                      {registeredContests.has(c.id) ? (
                        <span className="flex items-center gap-1">
                          <CheckCircle2 size={10} /> Registered
                        </span>
                      ) : (
                        "Register"
                      )}
                    </Button>
                  </Link>
                ))}
              </div>
            </div>
          )}

          <div>
            <div className="flex items-center justify-between mb-2">
              <p className="section-label">Past Contests</p>
            </div>
            <div className="surface-card rounded-xl overflow-hidden">
              {past.slice(0, 4).map((c) => (
                <Link
                  key={c.id}
                  href={`/contest/${c.id}`}
                  className="flex items-center justify-between px-4 py-3 hover:bg-muted/30 dark:hover:bg-white/[0.03] transition-colors group border-b border-border last:border-0"
                >
                  <div className="flex items-center gap-3">
                    <div className="flex size-9 items-center justify-center rounded-lg bg-muted">
                      <Trophy size={14} className="text-muted-foreground" />
                    </div>
                    <div className="min-w-0">
                      <p className="text-sm font-medium group-hover:text-primary transition-colors truncate">
                        {c.name}
                      </p>
                      <p className="text-xs text-muted-foreground mt-0.5">
                        {new Date(c.startTime).toLocaleDateString("en-US", {
                          month: "short",
                          day: "numeric",
                          year: "numeric",
                        })}
                        <span className="mx-1.5 text-muted-foreground/30">·</span>
                        <Users size={10} className="inline -mt-0.5 mr-0.5" />
                        {c.participantCount.toLocaleString()} participants
                      </p>
                    </div>
                  </div>
                  <ArrowRightIcon
                    size={14}
                    className="text-muted-foreground/20 group-hover:text-primary transition-colors shrink-0"
                  />
                </Link>
              ))}
            </div>
          </div>
        </div>

        <div className="space-y-6">
          <div>
            <div className="flex items-center justify-between mb-2">
              <p className="section-label">Global Leaderboard</p>
              <Link
                href="/contest/leaderboard"
                className="text-xs text-muted-foreground hover:text-foreground transition-colors"
              >
                Full list
              </Link>
            </div>
            <div className="surface-card rounded-xl overflow-hidden">
              <div className="grid grid-cols-[2.5rem_1fr_3.5rem_3.5rem] gap-4 px-4 py-2.5 text-[10px] font-semibold uppercase tracking-[0.08em] text-muted-foreground/50 border-b border-border bg-muted/20">
                <span className="text-center">#</span>
                <span>User</span>
                <span className="text-right">Score</span>
                <span className="text-right">Time</span>
              </div>
              {CONTEST_LEADERBOARD.map((entry) => (
                <Link
                  key={entry.rank}
                  href={`/u/${entry.user}`}
                  className={cn(
                    "group grid grid-cols-[2.5rem_1fr_3.5rem_3.5rem] gap-4 px-4 py-2.5 text-sm items-center hover:bg-muted/30 dark:hover:bg-white/[0.03] transition-colors border-b border-border last:border-0",
                    entry.user === CURRENT_USER.userName && "bg-primary/5",
                  )}
                >
                  <div className="flex justify-center">
                    <RankBadge rank={entry.rank} />
                  </div>
                  <span
                    className={cn(
                      "font-medium truncate",
                      entry.user === CURRENT_USER.userName
                        ? "text-primary"
                        : "text-muted-foreground group-hover:text-primary transition-colors",
                    )}
                  >
                    {entry.user}
                    {entry.user === CURRENT_USER.userName && (
                      <span className="ml-1.5 text-[10px] text-muted-foreground/50">(you)</span>
                    )}
                  </span>
                  <span className="text-right font-mono text-sm tabular-nums">
                    {entry.score}
                  </span>
                  <span className="text-right text-xs text-muted-foreground font-mono tabular-nums">
                    {entry.penalty}
                  </span>
                </Link>
              ))}
              <Link
                href="/contest/leaderboard"
                className="flex items-center justify-center gap-1 py-2.5 text-xs text-muted-foreground hover:text-foreground transition-colors"
              >
                View full leaderboard <ArrowRightIcon size={10} />
              </Link>
            </div>
          </div>

          <div className="surface-card rounded-xl p-5">
            <h3 className="text-sm font-medium mb-3">Contest Schedule</h3>
            <div className="space-y-2.5 text-xs">
              <div className="flex items-center justify-between">
                <span className="text-muted-foreground">Weekly Contest</span>
                <span className="font-medium">Sunday, 8:00 AM</span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-muted-foreground">Biweekly Contest</span>
                <span className="font-medium">Saturday, 10:30 PM</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
