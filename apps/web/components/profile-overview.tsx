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
  Calendar,
  Medal,
  Star,
  Lightning,
} from "@phosphor-icons/react/dist/ssr";

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
  totalEasy: number;
  totalMedium: number;
  totalHard: number;
};

function DonutChart({
  easySolved,
  mediumSolved,
  hardSolved,
  totalEasy,
  totalMedium,
  totalHard,
}: DonutChartProps) {
  const radius = 44;
  const strokeWidth = 8;
  const circumference = 2 * Math.PI * radius;
  const totalProblems = totalEasy + totalMedium + totalHard;
  const segments = [
    { solved: easySolved, total: totalEasy, color: "var(--success)" },
    { solved: mediumSolved, total: totalMedium, color: "var(--warning)" },
    { solved: hardSolved, total: totalHard, color: "var(--error)" },
  ];
  let offset = 0;
  const arcs = segments.map((seg) => {
    const fraction = seg.total > 0 ? seg.solved / totalProblems : 0;
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
          stroke="var(--text-disabled)"
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
          />
        ))}
      </svg>
      <div className="absolute inset-0 flex flex-col items-center justify-center">
        <span className="text-2xl font-medium tabular-nums text-primary">
          {easySolved + mediumSolved + hardSolved}
        </span>
        <span className="text-[10px] text-secondary font-mono-label mt-0.5">
          SOLVED
        </span>
      </div>
    </div>
  );
}

export async function ProfileOverview({ user }: { user: ProfileUser }) {
  const totalSolved = user.solvedEasy + user.solvedMedium + user.solvedHard;

  const [{ easy, hard, medium }, session, activity] = await Promise.all([
    getProblemTotals(),
    auth.api.getSession({ headers: await headers() }),
    getUserActivityHeatmap(user.id),
  ]);

  const achievements = [
    {
      label: "FIRST SOLVE",
      desc: "Solved your first problem",
      icon: Star,
      earned: totalSolved > 0,
      color: "status-warning",
    },
    {
      label: "WEEK STREAK",
      desc: "7-day solving streak",
      icon: Lightning,
      earned: totalSolved > 6,
      color: "text-primary",
    },
    {
      label: "CENTURY",
      desc: "Solve 100 problems",
      icon: Medal,
      earned: totalSolved > 99,
      color: "status-success",
    },
  ] as const;

  return (
    <div className="grid gap-5 lg:grid-cols-[240px_1fr]">
      <div className="space-y-4">
        <div className="nothing-card p-5 text-center">
          <div className="mx-auto flex size-16 items-center justify-center relative rounded overflow-hidden">
            {user.image ? (
              <Image
                width={80}
                height={80}
                alt="profile"
                loading="eager"
                src={user.image}
              />
            ) : (
              <span className="text-xl font-medium text-primary bg-linear-to-br from-muted via-muted-foreground/30 border to-background size-full flex items-center justify-center">
                {user.name.charAt(0)}
              </span>
            )}
          </div>
          <span className="font-mono-label text-secondary text-xs mt-3 block">
            PROFILE
          </span>
          <h1 className="text-display mt-1">{user.name}</h1>
          <p className="text-sm text-secondary">@{user.username}</p>

          {session?.user.id === user.id && (
            <Link href="/settings">
              <Button
                variant="outline"
                size="sm"
                className="mt-4 w-full rounded text-xs font-medium h-8"
              >
                Edit Profile
              </Button>
            </Link>
          )}
        </div>

        <div className="nothing-card p-4 space-y-2.5">
          {[
            { icon: Calendar, label: `${user.streak} DAY STREAK` },
            {
              icon: () => (
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  x="0px"
                  y="0px"
                  width="16"
                  height="16"
                  viewBox="0 0 30 30"
                  className="-ml-0.5"
                >
                  <path d="M15,3C8.373,3,3,8.373,3,15c0,5.623,3.872,10.328,9.092,11.63C12.036,26.468,12,26.28,12,26.047v-2.051 c-0.487,0-1.303,0-1.508,0c-0.821,0-1.551-0.353-1.905-1.009c-0.393-0.729-0.461-1.844-1.435-2.526 c-0.289-0.227-0.069-0.486,0.264-0.451c0.615,0.174,1.125,0.596,1.605,1.222c0.478,0.627,0.703,0.769,1.596,0.769 c0.433,0,1.081-0.025,1.691-0.121c0.328-0.833,0.895-1.6,1.588-1.962c-3.996-0.411-5.903-2.399-5.903-5.098 c0-1.162,0.495-2.286,1.336-3.233C9.053,10.647,8.706,8.73,9.435,8c1.798,0,2.885,1.166,3.146,1.481C13.477,9.174,14.461,9,15.495,9 c1.036,0,2.024,0.174,2.922,0.483C18.675,9.17,19.763,8,21.565,8c0.732,0.731,0.381,2.656,0.102,3.594 c0.836,0.945,1.328,2.066,1.328,3.226c0,2.697-1.904,4.684-5.894,5.097C18.199,20.49,19,22.1,19,23.313v2.734 c0,0.104-0.023,0.179-0.035,0.268C23.641,24.676,27,20.236,27,15C27,8.373,21.627,3,15,3z"></path>
                </svg>
              ),
              label: user.githubUrl ?? "NOT LINKED",
              link: user.githubUrl,
            },
            { icon: Trophy, label: `${user.rating} RATING` },
          ].map((item, i) => (
            <div
              key={i}
              className="flex items-center gap-2.5 text-sm text-secondary"
            >
              <item.icon
                size={14}
                weight="regular"
                className="text-disabled shrink-0"
              />
              <span
                className={cn(
                  "font-mono-label text-xs truncate",
                  item.link &&
                    "hover:text-primary cursor-pointer transition-colors duration-200 ease-out",
                )}
              >
                {item.label}
              </span>
            </div>
          ))}
        </div>

        <div className="nothing-card p-4 grid grid-cols-2 gap-2">
          {[
            {
              label: "RANK",
              value: `#${user.globalRank ?? "N/A"}`,
              icon: Trophy,
              status: "status-warning",
            },
            {
              label: "CONTESTS",
              value: `${user._count.participations}`,
              icon: Calendar,
              status: "text-primary",
            },
          ].map((s) => (
            <div key={s.label} className="text-center p-3">
              <s.icon
                size={14}
                weight="regular"
                className={cn("mx-auto mb-1.5 shrink-0", s.status)}
              />
              <p className="text-base font-medium leading-none tabular-nums text-primary">
                {s.value}
              </p>
              <p className="font-mono-label text-secondary text-[10px] mt-1">
                {s.label}
              </p>
            </div>
          ))}
        </div>

        <div className="nothing-card p-4">
          <h2 className="font-mono-label text-secondary text-xs mb-3">
            ACHIEVEMENTS
          </h2>

          <div className="space-y-3">
            {achievements.map((a) => (
              <div
                key={a.label}
                className={cn(
                  "flex items-center gap-2.5 py-1 transition-opacity duration-200 ease-out",
                  a.earned ? "opacity-100" : "opacity-40",
                )}
              >
                <a.icon
                  size={14}
                  weight="regular"
                  className={cn("shrink-0", a.color)}
                />
                <div className="min-w-0">
                  <p className="font-mono-label text-xs leading-tight text-primary">
                    {a.label}
                  </p>
                  <p className="text-[10px] text-secondary truncate">
                    {a.desc}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      <div className="space-y-4">
        <div className="nothing-card p-5">
          <h2 className="font-mono-label text-secondary text-xs mb-4">
            SOLVED PROBLEMS
          </h2>
          <div className="flex flex-col sm:flex-row items-center gap-6">
            <DonutChart
              easySolved={user.solvedEasy}
              mediumSolved={user.solvedMedium}
              hardSolved={user.solvedHard}
              totalEasy={easy}
              totalMedium={medium}
              totalHard={hard}
            />
            <div className="flex-1 w-full space-y-3">
              {[
                {
                  label: "EASY",
                  solved: user.solvedEasy,
                  total: easy,
                  color: "bg-emerald-500",
                  text: "status-success",
                },
                {
                  label: "MEDIUM",
                  solved: user.solvedMedium,
                  total: medium,
                  color: "bg-amber-500",
                  text: "status-warning",
                },
                {
                  label: "HARD",
                  solved: user.solvedHard,
                  total: hard,
                  color: "bg-rose-500",
                  text: "status-error",
                },
              ].map((d) => (
                <div key={d.label} className="space-y-1.5">
                  <div className="flex items-center justify-between">
                    <span className={cn("font-mono-label", d.text)}>
                      {d.label}
                    </span>
                    <span className="font-mono-label text-secondary tabular-nums">
                      <span className="text-primary">{d.solved}</span> /{" "}
                      {d.total}
                    </span>
                  </div>
                  <div className="h-1.5 w-full bg-(--text-disabled)/20 rounded-full overflow-hidden">
                    <div
                      className={cn(
                        "h-full transition-all duration-500 ease-out",
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

        <div className="nothing-card p-5 overflow-x-auto">
          <h2 className="font-mono-label text-secondary text-xs mb-4">
            ACTIVITY
          </h2>
          <div className="mx-1">
            <ActivityHeatmap data={activity} />
          </div>
        </div>

        <div className="nothing-card p-4">
          <h2 className="font-mono-label text-secondary text-xs mb-3">
            CONTEST STATS
          </h2>
          <div className="space-y-2">
            {[
              { label: "RATING", value: user.rating.toString() },
              {
                label: "GLOBAL RANKING",
                value: user.globalRank ? `#${user.globalRank}` : "N/A",
              },
              {
                label: "ATTENDED",
                value: user._count.participations.toString(),
              },
              { label: "STREAK", value: `${user.streak} DAYS` },
            ].map((item) => (
              <div
                key={item.label}
                className="flex items-center justify-between text-sm"
              >
                <span className="font-mono-label text-secondary text-xs">
                  {item.label}
                </span>
                <span className="font-mono-label text-primary tabular-nums text-xs">
                  {item.value}
                </span>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
