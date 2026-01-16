import Link from "next/link";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import {
  Code2,
  ArrowRight,
  CheckCircle2,
  Circle,
  Terminal,
  BarChart3,
  Trophy,
  Zap,
} from "lucide-react";

const SECTIONS = [
  {
    num: "01",
    tag: "Practice",
    heading: "Master algorithms through deliberate practice",
    description:
      "Solve 2,500+ curated problems organized by topic, difficulty, and real interview patterns. Progress at your own pace with a learning system that adapts to you.",
    features: ["Topic filtering", "Difficulty levels", "Interview prep tracks"],
    icon: Terminal,
  },
  {
    num: "02",
    tag: "Compete",
    heading: "Sharpen your skills under pressure",
    description:
      "Compete in weekly contests against developers worldwide. Earn ratings and climb the global leaderboard. Real-time scoring keeps you in the zone.",
    features: ["Live rankings", "Real-time scoring", "Rating system"],
    icon: Trophy,
  },
  {
    num: "03",
    tag: "Track",
    heading: "Measure your progress with precision",
    description:
      "Visualize your journey with detailed analytics, activity heatmaps, and skill breakdowns. Understand your strengths and target your weaknesses.",
    features: ["Activity heatmap", "Streak tracking", "Performance insights"],
    icon: BarChart3,
  },
];

const TESTIMONIALS = [
  {
    quote:
      "CodeArena helped me land my dream job at Google. The problem quality and tracking is unmatched.",
    name: "Sarah Chen",
    role: "Software Engineer",
    company: "Google",
  },
  {
    quote:
      "The cleanest practice platform I've ever used. It's like Linear but for competitive programming.",
    name: "Raj Patel",
    role: "Senior Developer",
    company: "Microsoft",
  },
  {
    quote:
      "Weekly contests keep me sharp and motivated. The rating system is perfectly calibrated.",
    name: "Emily Rodriguez",
    role: "ML Engineer",
    company: "Meta",
  },
];

function CodeSnippent() {
  const CODE_SNIPPET = `<span class="text-violet-400">function</span> <span class="text-blue-400">twoSum</span><span>(nums, target) {</span>
  <span class="text-violet-400">const</span> <span>seen = </span><span class="text-violet-400">new</span> <span class="text-blue-400">Map</span><span>();</span>
  <span class="text-violet-400">for</span> <span>(</span><span class="text-violet-400">let</span> <span>i = 0; i &lt; nums.length; i++) {</span>
    <span class="text-violet-400">const</span> <span>needed = target - nums[i];</span>
    <span class="text-violet-400">if</span> <span>(seen.</span><span class="text-blue-400">has</span><span>(needed))</span>
      <span class="text-violet-400">return</span> <span>[seen.</span><span class="text-blue-400">get</span><span>(needed), i];</span>
    <span>seen.</span><span class="text-blue-400">set</span><span>(nums[i], i);</span>
  <span>}</span>
<span>}</span>`;

  return (
    <div className="relative mt-16">
      <div className="absolute -inset-8 -z-10 bg-linear-to-r from-primary/50 to-primary/50 opacity-10 blur-3xl rounded-3xl" />

      <div className="relative z-10 bg-background rounded-xl overflow-hidden shadow-2xl shadow-black/10 dark:shadow-black/40 border">
        <div className="flex items-center h-10 px-4 bg-secondary/50 relative">
          <div className="flex gap-2 absolute top-1/2 left-4 -translate-y-1/2">
            <div className="size-3 rounded-full bg-foreground/10" />
            <div className="size-3 rounded-full bg-foreground/10" />
            <div className="size-3 rounded-full bg-foreground/10" />
          </div>
          <div className="flex-1 text-center text-xs text-muted-foreground font-medium tracking-wide">
            Two Sum
          </div>
        </div>

        <div className="flex h-85">
          <div className="sm:w-1/2 border-r border-border p-5 overflow-hidden">
            <div className="flex items-center gap-2.5 mb-4">
              <span className="text-sm font-semibold tracking-tight">
                1. Two Sum
              </span>
              <span className="text-[10px] font-medium text-emerald-500 bg-emerald-500/10 px-2 py-0.5 rounded-md">
                Easy
              </span>
            </div>
            <p className="text-xs text-muted-foreground leading-relaxed mb-4">
              Given an array{" "}
              <code className="text-primary bg-primary/10 px-1.5 py-0.5 rounded text-[10px] font-mono">
                nums
              </code>{" "}
              and a target, return indices of two numbers that add up to target.
            </p>
            <div className="bg-secondary/40 rounded-lg p-3.5 text-xs font-mono space-y-2">
              <div>
                <p className="text-muted-foreground/60 text-[9px] font-sans font-medium uppercase tracking-widest mb-1">
                  Input
                </p>
                <p className="text-foreground/80">
                  nums = [2,7,11,15], target = 9
                </p>
              </div>
              <div>
                <p className="text-muted-foreground/60 text-[9px] font-sans font-medium uppercase tracking-widest mb-1">
                  Output
                </p>
                <p className="text-emerald-500">[0,1]</p>
              </div>
            </div>
          </div>

          <div className="flex-1 hidden sm:flex flex-col ">
            <div className="flex items-center justify-between px-4 h-9 border-b text-xs">
              <span className="font-medium">Code</span>
              <span>JavaScript</span>
            </div>
            <div className="flex-1 p-4 overflow-hidden">
              <pre
                className="font-mono text-xs leading-[1.8] text-foreground/90"
                dangerouslySetInnerHTML={{ __html: CODE_SNIPPET }}
              />
            </div>
            <div className="flex items-center justify-between px-4 h-10 border-t">
              <div className="flex gap-2">
                <span className="text-[10px] bg-accent px-2.5 py-1 rounded-md font-medium">
                  Run
                </span>
                <span className="text-[10px] font-medium text-white gradient-primary px-2.5 py-1 rounded-md">
                  Submit
                </span>
              </div>
              <span className="text-xs text-emerald-400 font-medium flex items-center gap-1.5">
                <CheckCircle2 size={11} />
                Accepted
              </span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

function ProblemMockup() {
  const problems = [
    { title: "Two Sum", diff: "Easy", solved: true },
    { title: "Add Two Numbers", diff: "Medium", solved: true },
    {
      title: "Longest Substring Without Repeating Characters",
      diff: "Medium",
      solved: false,
    },
    { title: "Median of Two Sorted Arrays", diff: "Hard", solved: false },
    { title: "Reverse Linked List", diff: "Easy", solved: true },
  ];

  return (
    <div className="surface-card rounded-xl overflow-hidden">
      <div className="px-4 py-3 border-b border-border flex items-center justify-between text-xs">
        <span className="text-muted-foreground font-medium">Problems</span>
        <span className="text-muted-foreground/50">Difficulty</span>
      </div>
      {problems.map((p, i) => (
        <div
          key={i}
          className="flex items-center justify-between px-4 py-3 border-b border-border last:border-0 transition-colors hover:bg-muted/30"
        >
          <div className="flex items-center gap-3 min-w-0">
            {p.solved ? (
              <CheckCircle2 size={15} className="text-emerald-500 shrink-0" />
            ) : (
              <Circle size={15} className="text-muted-foreground/15 shrink-0" />
            )}
            <span className="text-sm truncate">{p.title}</span>
          </div>
          <span
            className={cn(
              "text-xs font-medium shrink-0 ml-3",
              p.diff === "Easy" && "text-emerald-500",
              p.diff === "Medium" && "text-amber-500",
              p.diff === "Hard" && "text-rose-500",
            )}
          >
            {p.diff}
          </span>
        </div>
      ))}
    </div>
  );
}

function HeatmapMockup() {
  return (
    <div className="surface-card rounded-xl p-5">
      <div className="flex items-center justify-between mb-4">
        <span className="text-sm">
          <span className="font-semibold tabular-nums">247</span>
          <span className="text-muted-foreground ml-1">submissions</span>
        </span>
        <span className="text-xs text-muted-foreground flex items-center gap-1.5">
          <Zap size={11} className="text-orange-500" />
          12 day streak
        </span>
      </div>
      <div
        className="grid gap-0.75"
        style={{ gridTemplateColumns: "repeat(20, 1fr)" }}
      >
        {Array.from({ length: 140 }, (_, i) => {
          const seed = ((i * 2654435761) >>> 0) % 100;
          const level =
            seed > 85 ? 4 : seed > 70 ? 3 : seed > 50 ? 2 : seed > 30 ? 1 : 0;
          const colors = [
            "bg-foreground/[0.04]",
            "bg-emerald-500/20",
            "bg-emerald-500/35",
            "bg-emerald-500/55",
            "bg-emerald-500",
          ];
          return (
            <div
              key={i}
              className={cn("aspect-square rounded-[2px]", colors[level])}
            />
          );
        })}
      </div>
    </div>
  );
}

function ContestMockup() {
  return (
    <div className="surface-card rounded-xl p-5">
      <div className="flex items-center gap-2 mb-4">
        <Trophy size={14} className="text-amber-500" />
        <span className="text-sm font-medium">Weekly Contest 382</span>
      </div>
      <div className="space-y-2">
        {[
          { rank: 1, user: "alice_dev", score: "18/18", badge: "🥇" },
          { rank: 2, user: "bob_coder", score: "18/18", badge: "🥈" },
          { rank: 3, user: "charlie_io", score: "16/18", badge: "🥉" },
          { rank: 4, user: "you", score: "14/18", badge: "" },
        ].map((e) => (
          <div
            key={e.rank}
            className={cn(
              "flex items-center justify-between py-2 px-3 rounded-lg text-sm",
              e.user === "you" && "bg-primary/5 border border-primary/10",
            )}
          >
            <div className="flex items-center gap-2.5">
              <span className="text-xs text-muted-foreground w-4 text-center tabular-nums font-mono">
                {e.badge || e.rank}
              </span>
              <span
                className={cn(
                  "font-medium",
                  e.user === "you" && "text-primary",
                )}
              >
                {e.user}
              </span>
            </div>
            <span className="text-xs text-muted-foreground font-mono">
              {e.score}
            </span>
          </div>
        ))}
      </div>
    </div>
  );
}

export default function Landing() {
  return (
    <div className="min-h-screen bg-background">
      <section className="relative pt-24 pb-8 px-6 overflow-hidden">
        <div className="relative mx-auto max-w-250">
          <div className="text-center">
            <h1 className="text-[clamp(2.5rem,6vw,4.5rem)] font-medium tracking-tighter leading-[1.08] mb-5 animate-fade-in !delay-75">
              The platform for
              <br />
              <span className="gradient-text">problem solvers</span>
            </h1>
            <p className="text-muted-foreground max-w-lg mx-auto text-base leading-relaxed mb-10 animate-fade-in !delay-100">
              Master algorithms, compete in contests, and track your growth.
              Built for developers who take practice seriously.
            </p>
            <div className="flex items-center justify-center gap-3 animate-fade-in !delay-150">
              <Button
                className="gradient-primary text-white font-medium h-10"
                nativeButton={false}
                render={
                  <Link href="/problems" prefetch={false}>
                    Start Practicing
                    <ArrowRight size={14} className="ml-1.5" />
                  </Link>
                }
              />

              <Button
                variant="outline"
                className="h-10 px-6 font-medium"
                nativeButton={false}
                render={
                  <Link href="/sign-in" prefetch={false}>
                    Sign in
                  </Link>
                }
              />
            </div>
          </div>

          <div className="animate-fade-in !delay-200">
            <CodeSnippent />
          </div>
        </div>
      </section>

      <section className="border-y border-border mt-20">
        <div className="mx-auto max-w-250 grid grid-cols-3 divide-x divide-border">
          {[
            { value: "2,500+", label: "Problems" },
            { value: "150K+", label: "Active Users" },
            { value: "Weekly", label: "Contests" },
          ].map((s) => (
            <div
              key={s.label}
              className="flex flex-col items-center py-8 sm:py-10"
            >
              <span className="text-2xl sm:text-3xl font-medium tracking-tight tabular-nums">
                {s.value}
              </span>
              <span className="text-xs text-muted-foreground mt-1.5 tracking-wide">
                {s.label}
              </span>
            </div>
          ))}
        </div>
      </section>

      <section className="mx-auto max-w-250 px-6 py-24 space-y-36">
        {SECTIONS.map((section, idx) => (
          <div
            key={section.num}
            className={cn(
              "flex flex-col gap-10 lg:flex-row lg:items-center",
              idx % 2 === 1 && "lg:flex-row-reverse",
            )}
          >
            <div className="lg:w-[45%]">
              <div className="flex items-center gap-2.5 mb-4">
                <span className="section-number text-sm">{section.num}</span>
                <span className="text-xs text-muted-foreground font-medium">
                  {section.tag}
                </span>
              </div>
              <h2 className="text-2xl sm:text-3xl font-medium tracking-tight leading-snug mb-4">
                {section.heading}
              </h2>
              <p className="text-muted-foreground text-sm leading-relaxed mb-6">
                {section.description}
              </p>
              <div className="flex flex-wrap gap-2">
                {section.features.map((f) => (
                  <span
                    key={f}
                    className="text-xs text-muted-foreground border border-border rounded-full px-3 py-1.5 transition-colors hover:border-foreground/20 hover:text-foreground"
                  >
                    {f}
                  </span>
                ))}
              </div>
            </div>
            <div className="lg:flex-1">
              {idx === 0 && <ProblemMockup />}
              {idx === 1 && <ContestMockup />}
              {idx === 2 && <HeatmapMockup />}
            </div>
          </div>
        ))}
      </section>

      <section className="border-t border-border py-20">
        <div className="mx-auto max-w-250 px-6">
          <div className="mb-12">
            <span className="text-xs text-muted-foreground font-medium tracking-wide">
              Testimonials
            </span>
            <h2 className="mt-2 text-2xl font-medium tracking-tight">
              Loved by developers worldwide
            </h2>
          </div>
          <div className="grid gap-4 sm:grid-cols-3">
            {TESTIMONIALS.map((t) => (
              <div
                key={t.name}
                className="bg-card rounded-xl p-6 transition-all duration-200 hover:border-foreground/10 dark:hover:border-white/12"
              >
                <p className="text-sm leading-relaxed mb-5 text-foreground/80">
                  &ldquo;{t.quote}&rdquo;
                </p>
                <div className="flex items-center gap-3">
                  <div className="size-9 rounded-full bg-linear-to-br from-primary/20 to-transparent flex items-center justify-center text-xs font-semibold text-primary">
                    {t.name[0]}
                  </div>
                  <div>
                    <p className="text-sm font-medium">{t.name}</p>
                    <p className="text-xs text-muted-foreground">
                      {t.role}, {t.company}
                    </p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="mx-auto max-w-3xl px-6 py-24">
        <div className="text-center">
          <h2 className="text-3xl font-medium tracking-tight mb-3">
            Ready to level up?
          </h2>
          <p className="text-muted-foreground text-sm mb-8">
            Join thousands of developers practicing daily.
          </p>
          <Button
            className="h-11 px-8 rounded-lg gradient-primary border-0 text-white text-sm font-medium"
            nativeButton={false}
            render={
              <Link href="/problems" prefetch={false}>
                Get Started <ArrowRight size={14} className="ml-1.5" />
              </Link>
            }
          />
        </div>
      </section>

      <footer className="border-t border-border">
        <div className="mx-auto max-w-7xl px-6 lg:px-0 py-6 flex flex-col sm:flex-row items-center justify-between gap-4 text-xs text-muted-foreground">
          <div className="flex items-center gap-2.5">
            <div className="size-5 rounded-md bg-foreground flex items-center justify-center">
              <Code2 size={10} className="text-background" strokeWidth={2.5} />
            </div>
            <span>&copy; {new Date().getFullYear()} CodeArena</span>
          </div>
          <div className="flex items-center gap-6">
            {["Privacy", "Terms", "Problems"].map((link) => (
              <Link
                key={link}
                prefetch={false}
                href={link === "Problems" ? "/problems" : "#"}
                className="hover:text-foreground transition-colors"
              >
                {link}
              </Link>
            ))}
          </div>
        </div>
      </footer>
    </div>
  );
}
