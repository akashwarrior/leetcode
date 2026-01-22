import Link from "next/link";
import { Button } from "@/components/ui/button";
import { ArrowRight, CodeBlock } from "@phosphor-icons/react/dist/ssr";

const FEATURES = [
  {
    num: "01",
    label: "PRACTICE",
    heading: "Master algorithms through deliberate practice",
    body: "Solve 2,500+ curated problems organized by topic, difficulty, and real interview patterns.",
  },
  {
    num: "02",
    label: "COMPETE",
    heading: "Sharpen your skills under pressure",
    body: "Weekly contests against developers worldwide. Real-time scoring and a rating system that rewards consistency.",
  },
  {
    num: "03",
    label: "TRACK",
    heading: "Measure your progress with precision",
    body: "Activity heatmaps, streak tracking, and skill breakdowns. Understand your strengths. Target your weaknesses.",
  },
];

export default function Landing() {
  return (
    <div className="min-h-screen bg-background flex flex-col">
      <div className="flex flex-col gap-16 sm:gap-24 px-4 sm:px-6 py-12 sm:py-16">
        <section>
          <div className="max-w-4xl mx-auto">
            <p className="font-mono-label mb-4">CODE ARENA - v1.0</p>
            <h1 className="text-display text-5xl sm:text-7xl md:text-8xl leading-[0.95] tracking-tighter mb-6">
              Solve.
              <br />
              Compete.
              <br />
              Improve.
            </h1>
            <p className="text-secondary text-base sm:text-lg leading-relaxed max-w-md mb-10">
              A coding platform built for developers who take practice
              seriously. No fluff. No gamification. Just problems and progress.
            </p>
            <div className="flex items-center gap-3">
              <Button
                className="nothing-btn nothing-btn-primary h-10 px-6"
                nativeButton={false}
                render={
                  <Link href="/problems" prefetch={false}>
                    Start Practicing
                    <ArrowRight size={14} />
                  </Link>
                }
              />
              <Button
                variant="outline"
                className="nothing-btn nothing-btn-outline h-10 px-6"
                nativeButton={false}
                render={
                  <Link href="/sign-in" prefetch={false}>
                    Sign In
                  </Link>
                }
              />
            </div>
          </div>
        </section>

        <section className="border-y border-border py-12">
          <div className="max-w-4xl mx-auto grid grid-cols-3 gap-8">
            {[
              { value: "2,500+", label: "PROBLEMS" },
              { value: "150K+", label: "DEVELOPERS" },
              { value: "WEEKLY", label: "CONTESTS" },
            ].map((s) => (
              <div key={s.label} className="flex flex-col">
                <span className="text-display text-2xl sm:text-3xl tracking-tight tabular-nums">
                  {s.value}
                </span>
                <span className="font-mono-label mt-1">{s.label}</span>
              </div>
            ))}
          </div>
        </section>

        <section className="py-8 sm:py-16">
          <div className="max-w-4xl mx-auto space-y-24 sm:space-y-32">
            {FEATURES.map((f) => (
              <div
                key={f.num}
                className="flex flex-col sm:flex-row sm:items-start gap-8 sm:gap-16"
              >
                <div className="sm:w-32 shrink-0">
                  <span className="font-mono-label">{f.num}</span>
                  <p className="font-mono-label mt-1">{f.label}</p>
                </div>
                <div className="flex-1">
                  <h2 className="text-2xl sm:text-3xl font-medium tracking-tight leading-snug mb-3 text-primary">
                    {f.heading}
                  </h2>
                  <p className="text-secondary text-sm leading-relaxed max-w-lg">
                    {f.body}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </section>

        <section className="border-y border-border py-16">
          <div className="max-w-4xl mx-auto">
            <p className="font-mono-label mb-6">INTERFACE PREVIEW</p>
            <div className="nothing-card overflow-hidden">
              <div className="flex items-center h-8 px-4 border-b border-border bg-muted/30">
                <div className="flex gap-1.5">
                  <div className="size-2 rounded-full bg-muted-foreground/50" />
                  <div className="size-2 rounded-full bg-muted-foreground/50" />
                  <div className="size-2 rounded-full bg-muted-foreground/50" />
                </div>
                <div className="flex-1 text-center font-mono-label">
                  1. TWO SUM
                </div>
              </div>
              <div className="flex h-72 sm:h-80">
                <div className="sm:w-1/2 border-r border-border p-4 sm:p-5 bg-muted/20">
                  <div className="flex items-center gap-2 mb-4">
                    <span className="text-sm font-medium text-primary">
                      Two Sum
                    </span>
                    <span className="text-[0.625rem] font-mono uppercase tracking-widest status-success">
                      EASY
                    </span>
                  </div>
                  <p className="text-xs text-secondary leading-relaxed mb-4">
                    Given an array and a target, return indices of two numbers
                    that add up to target.
                  </p>
                  <div className="space-y-3 font-mono text-xs">
                    <div>
                      <p className="font-mono-label mb-1">INPUT</p>
                      <p className="text-primary">
                        nums = [2,7,11,15], target = 9
                      </p>
                    </div>
                    <div>
                      <p className="font-mono-label mb-1">OUTPUT</p>
                      <p className="status-success">[0,1]</p>
                    </div>
                  </div>
                </div>
                <div className="flex-1 hidden sm:flex flex-col dark:bg-[#1a1a1a] bg-[#f6f6f6]">
                  <div className="flex items-center justify-between px-4 h-8 border-b border-border/30">
                    <span className="text-xs font-medium dark:text-white/70 text-[#1a1a1a]/70">
                      CODE
                    </span>
                    <span className="text-[0.625rem] font-mono uppercase tracking-widest dark:text-white/40 text-[#1a1a1a]/40">
                      JAVASCRIPT
                    </span>
                  </div>
                  <div className="flex-1 p-4 overflow-hidden">
                    <pre className="font-mono text-[0.6875rem] leading-[1.8]">
                      <code>
                        <span className="dark:text-[#c084fc] text-[#7c3aed]">
                          function
                        </span>{" "}
                        <span className="dark:text-[#60a5fa] text-[#2563eb]">
                          twoSum
                        </span>
                        <span className="dark:text-white/60 text-[#1a1a1a]/50">
                          (nums, target) {"{"}
                        </span>
                        {"\n"}
                        {"  "}
                        <span className="dark:text-[#c084fc] text-[#7c3aed]">
                          const
                        </span>{" "}
                        <span className="dark:text-white/80 text-[#1a1a1a]/80">
                          seen ={" "}
                        </span>
                        <span className="dark:text-[#c084fc] text-[#7c3aed]">
                          new
                        </span>{" "}
                        <span className="dark:text-[#60a5fa] text-[#2563eb]">
                          Map
                        </span>
                        <span className="dark:text-white/60 text-[#1a1a1a]/50">
                          ();
                        </span>
                        {"\n"}
                        {"  "}
                        <span className="dark:text-[#c084fc] text-[#7c3aed]">
                          for
                        </span>{" "}
                        <span className="dark:text-white/60 text-[#1a1a1a]/50">
                          (
                        </span>
                        <span className="dark:text-[#c084fc] text-[#7c3aed]">
                          let
                        </span>{" "}
                        <span className="dark:text-white/80 text-[#1a1a1a]/80">
                          i = 0; i &lt; nums.length; i++) {"{"}
                        </span>
                        {"\n"}
                        {"    "}
                        <span className="dark:text-[#c084fc] text-[#7c3aed]">
                          const
                        </span>{" "}
                        <span className="dark:text-white/80 text-[#1a1a1a]/80">
                          needed = target - nums[i];
                        </span>
                        {"\n"}
                        {"    "}
                        <span className="dark:text-[#c084fc] text-[#7c3aed]">
                          if
                        </span>{" "}
                        <span className="dark:text-white/60 text-[#1a1a1a]/50">
                          (seen.
                        </span>
                        <span className="dark:text-[#60a5fa] text-[#2563eb]">
                          has
                        </span>
                        <span className="dark:text-white/60 text-[#1a1a1a]/50">
                          (needed))
                        </span>
                        {"\n"}
                        {"      "}
                        <span className="dark:text-[#c084fc] text-[#7c3aed]">
                          return
                        </span>{" "}
                        <span className="dark:text-white/60 text-[#1a1a1a]/50">
                          [seen.
                        </span>
                        <span className="dark:text-[#60a5fa] text-[#2563eb]">
                          get
                        </span>
                        <span className="dark:text-white/60 text-[#1a1a1a]/50">
                          (needed), i];
                        </span>
                        {"\n"}
                        {"    "}
                        <span className="dark:text-white/60 text-[#1a1a1a]/50">
                          seen.
                        </span>
                        <span className="dark:text-[#60a5fa] text-[#2563eb]">
                          set
                        </span>
                        <span className="dark:text-white/60 text-[#1a1a1a]/50">
                          (nums[i], i);
                        </span>
                        {"\n"}
                        {"  "}
                        <span className="dark:text-white/60 text-[#1a1a1a]/50">
                          {"}"}
                        </span>
                        {"\n"}
                        <span className="dark:text-white/60 text-[#1a1a1a]/50">
                          {"}"}
                        </span>
                      </code>
                    </pre>
                  </div>
                  <div className="flex items-center justify-between px-4 h-9 border-t border-border/30">
                    <div className="flex gap-2">
                      <span className="text-[0.6875rem] px-2 py-1 rounded dark:bg-white/10 bg-[#1a1a1a]/10 dark:text-white/60 text-[#1a1a1a]/60 font-medium">
                        RUN
                      </span>
                      <span className="text-[0.6875rem] px-3 py-1 rounded dark:bg-white bg-[#1a1a1a] dark:text-black text-white font-medium">
                        SUBMIT
                      </span>
                    </div>
                    <span className="text-[0.6875rem] font-mono uppercase tracking-widest status-success">
                      ACCEPTED
                    </span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>

        <section className="py-8 sm:py-16">
          <div className="max-w-4xl mx-auto">
            <h2 className="text-display text-4xl sm:text-5xl md:text-6xl leading-[0.95] tracking-tighter mb-4">
              Ready to
              <br />
              level up?
            </h2>
            <p className="text-secondary text-sm mb-8 max-w-sm">
              Join thousands of developers practicing daily. Free to start.
            </p>
            <Button
              className="nothing-btn nothing-btn-primary h-11 px-8"
              nativeButton={false}
              render={
                <Link href="/problems" prefetch={false}>
                  Get Started
                  <ArrowRight size={14} />
                </Link>
              }
            />
          </div>
        </section>
      </div>

      <footer className="border-t border-border">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 py-6 flex flex-col sm:flex-row items-center justify-between gap-4">
          <div className="flex items-center gap-2.5">
            <div className="size-5 rounded bg-primary flex items-center justify-center">
              <CodeBlock
                size={10}
                className="text-primary-foreground"
                weight="bold"
              />
            </div>
            <span className="text-xs text-secondary">
              &copy; {new Date().getFullYear()} CodeArena
            </span>
          </div>
          <div className="flex items-center gap-6">
            {["Privacy", "Terms", "Problems"].map((link) => (
              <Link
                key={link}
                prefetch={false}
                href={link === "Problems" ? "/problems" : "#"}
                className="text-xs text-secondary hover:text-primary transition-colors"
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
