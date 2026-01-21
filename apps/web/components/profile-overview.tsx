import Image from "next/image";
import { auth } from "@/lib/auth";
import { headers } from "next/headers";
import Link from "next/link";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { ActivityHeatmap } from "@/components/activity-heatmap";
import { getProblemTotals, getUserActivityHeatmap } from "@/lib/db/queries";
import {
  Trophy,
  CalendarClock,
  Award,
  Star,
  Zap,
  Target,
  TrendingUp,
} from "lucide-react";

type ProfileUser = {
  id: string;
  name: string;
  username: string;
  image: string | null;
  streak: number;
  githubUrl: string | null;
  rating: number;
  globalRank: number | null;
  solvedEasy: number;
  solvedMedium: number;
  solvedHard: number;
  _count: {
    participations: number;
  };
};

type DonutChartProps = {
  easySolved: number;
  mediumSolved: number;
  hardSolved: number;
  totalProblems: number;
};

function DonutChart({
  easySolved,
  mediumSolved,
  hardSolved,
  totalProblems,
}: DonutChartProps) {
  const radius = 44;
  const strokeWidth = 7;
  const circumference = 2 * Math.PI * radius;
  const segments = [
    { count: easySolved, color: "#22c55e" },
    { count: mediumSolved, color: "#f59e0b" },
    { count: hardSolved, color: "#ef4444" },
  ];
  let offset = 0;
  const arcs = segments.map((seg) => {
    const fraction = seg.count / totalProblems;
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
        <span className="text-2xl font-bold tabular-nums">
          {easySolved + mediumSolved + hardSolved}
        </span>
        <span className="text-[10px] text-muted-foreground font-medium">
          solved
        </span>
      </div>
    </div>
  );
}

export async function ProfileOverview({ user }: { user: ProfileUser }) {
  const totalSolved = user.solvedEasy + user.solvedMedium + user.solvedHard;

  const [problemTotals, session, activity] = await Promise.all([
    getProblemTotals(),
    auth.api.getSession({ headers: await headers() }),
    getUserActivityHeatmap(user.id),
  ]);

  const { easy, hard, medium, total: totalProblems } = problemTotals;

  const achievements = [
    {
      label: "First Solve",
      desc: "Solved your first problem",
      icon: Star,
      earned: totalSolved > 0,
      color: "text-amber-500",
      bg: "bg-amber-500/10",
    },
    {
      label: "Week Streak",
      desc: "7-day solving streak",
      icon: Zap,
      earned: totalSolved > 6,
      color: "text-primary",
      bg: "bg-primary/10",
    },
    {
      label: "Century",
      desc: "Solve 100 problems",
      icon: Award,
      earned: totalSolved > 99,
      color: "text-emerald-500",
      bg: "bg-emerald-500/10",
    },
  ] as const;

  return (
    <div className="grid gap-6 lg:grid-cols-[260px_1fr]">
      <div className="space-y-4">
        <div className="surface-card rounded-2xl p-6 text-center">
          <div className="mx-auto flex size-20 items-center justify-center rounded-2xl bg-linear-to-br from-primary/20 text-2xl font-bold text-primary relative overflow-hidden">
            {user.image ? (
              <Image
                width={100}
                height={100}
                alt="profile"
                loading="eager"
                src={user.image}
              />
            ) : (
              user.name[0]
            )}
          </div>
          <h1 className="mt-4 text-lg font-bold tracking-tight">{user.name}</h1>
          <p className="text-sm text-muted-foreground">@{user.username}</p>

          {session?.user.id === user.id && (
            <Link href="/settings">
              <Button
                variant="outline"
                size="sm"
                className="mt-5 w-full rounded-xl text-xs font-medium h-9"
              >
                Edit Profile
              </Button>
            </Link>
          )}
        </div>

        <div className="surface-card rounded-2xl p-5 space-y-3.5">
          {[
            // { icon: MapPin, label: "India" },
            { icon: CalendarClock, label: `${user.streak} day streak` },
            {
              icon: () => (
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  x="0px"
                  y="0px"
                  width="18"
                  height="18"
                  viewBox="0 0 30 30"
                  className="-ml-1"
                >
                  <path d="M15,3C8.373,3,3,8.373,3,15c0,5.623,3.872,10.328,9.092,11.63C12.036,26.468,12,26.28,12,26.047v-2.051 c-0.487,0-1.303,0-1.508,0c-0.821,0-1.551-0.353-1.905-1.009c-0.393-0.729-0.461-1.844-1.435-2.526 c-0.289-0.227-0.069-0.486,0.264-0.451c0.615,0.174,1.125,0.596,1.605,1.222c0.478,0.627,0.703,0.769,1.596,0.769 c0.433,0,1.081-0.025,1.691-0.121c0.328-0.833,0.895-1.6,1.588-1.962c-3.996-0.411-5.903-2.399-5.903-5.098 c0-1.162,0.495-2.286,1.336-3.233C9.053,10.647,8.706,8.73,9.435,8c1.798,0,2.885,1.166,3.146,1.481C13.477,9.174,14.461,9,15.495,9 c1.036,0,2.024,0.174,2.922,0.483C18.675,9.17,19.763,8,21.565,8c0.732,0.731,0.381,2.656,0.102,3.594 c0.836,0.945,1.328,2.066,1.328,3.226c0,2.697-1.904,4.684-5.894,5.097C18.199,20.49,19,22.1,19,23.313v2.734 c0,0.104-0.023,0.179-0.035,0.268C23.641,24.676,27,20.236,27,15C27,8.373,21.627,3,15,3z"></path>
                </svg>
              ),
              label: user.githubUrl ?? "Not Linked",
              link: user.githubUrl,
            },
            { icon: Trophy, label: user.rating + " Rating" },
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
                    "hover:text-primary cursor-pointer transition-colors",
                )}
              >
                {item.label}
              </span>
            </div>
          ))}
        </div>

        <div className="surface-card rounded-2xl p-5 grid grid-cols-2 gap-3">
          {[
            {
              label: "Rank",
              value: `#${user.globalRank ?? "N/A"}`,
              icon: Trophy,
              color: "text-amber-500",
              bg: "bg-amber-500/10",
            },
            {
              label: "Contests",
              value: `${user._count.participations}`,
              icon: CalendarClock,
              color: "text-primary",
              bg: "bg-primary/10",
            },
          ].map((s) => (
            <div
              key={s.label}
              className="text-center p-3.5 rounded-xl bg-border/30"
            >
              <div
                className={cn(
                  "mx-auto flex size-8 items-center justify-center rounded-lg mb-2",
                  s.bg,
                )}
              >
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

        <div className="surface-card rounded-2xl p-5">
          <h2 className="section-label mb-5 ml-1">Achievements</h2>

          <div className="space-y-6">
            {achievements.map((a) => (
              <div
                key={a.label}
                className={cn(
                  "flex items-center gap-3 rounded-xl transition-all duration-200",
                  a.earned ? "bg-muted/30 hover:bg-muted/50" : "opacity-25",
                )}
              >
                <div
                  className={cn(
                    "flex size-9 items-center justify-center rounded-lg shrink-0",
                    a.bg,
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

      <div className="space-y-5">
        <div className="surface-card rounded-2xl p-6">
          <div className="flex items-center gap-2.5 mb-6">
            <div className="flex size-7 items-center justify-center rounded-lg bg-primary/10">
              <Target size={14} className="text-primary" />
            </div>
            <h2 className="text-sm font-semibold">Solved Problems</h2>
          </div>
          <div className="flex flex-col sm:flex-row items-center gap-8">
            <DonutChart
              easySolved={user.solvedEasy}
              mediumSolved={user.solvedMedium}
              hardSolved={user.solvedHard}
              totalProblems={totalProblems}
            />
            <div className="flex-1 w-full space-y-4">
              {[
                {
                  label: "Easy",
                  solved: user.solvedEasy,
                  total: easy,
                  color: "bg-emerald-500",
                  text: "text-emerald-500",
                },
                {
                  label: "Medium",
                  solved: user.solvedMedium,
                  total: medium,
                  color: "bg-amber-500",
                  text: "text-amber-500",
                },
                {
                  label: "Hard",
                  solved: user.solvedHard,
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
                  <div className="h-1.25 rounded-full bg-muted overflow-hidden">
                    <div
                      className={cn(
                        "h-full rounded-full transition-all duration-700",
                        d.color,
                      )}
                      style={{ width: `${(d.solved / d.total) * 100}%` }}
                    />
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        <div className="surface-card rounded-2xl p-6 overflow-x-auto">
          <div className="flex items-center gap-2.5 mb-5">
            <div className="flex size-7 items-center justify-center rounded-lg bg-primary/10">
              <TrendingUp size={14} className="text-primary" />
            </div>
            <span className="text-sm font-semibold">Activity</span>
          </div>
          <div className="mx-2">
            <ActivityHeatmap data={activity} />
          </div>
        </div>

        <div className="surface-card rounded-2xl p-5">
          <div className="flex items-center gap-2.5 mb-4">
            <div className="flex size-7 items-center justify-center rounded-lg bg-amber-500/10">
              <Trophy size={14} className="text-amber-500" />
            </div>
            <h2 className="text-sm font-semibold">Contest Stats</h2>
          </div>
          <div className="space-y-3">
            {[
              { label: "Rating", value: user.rating.toString() },
              {
                label: "Global Ranking",
                value: user.globalRank ? `#${user.globalRank}` : "N/A",
              },
              {
                label: "Attended",
                value: user._count.participations.toString(),
              },
              { label: "Streak", value: `${user.streak} days` },
            ].map((item) => (
              <div
                key={item.label}
                className="flex items-center justify-between text-sm"
              >
                <span className="text-muted-foreground">{item.label}</span>
                <span className="font-semibold tabular-nums">{item.value}</span>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
