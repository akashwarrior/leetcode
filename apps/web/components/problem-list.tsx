"use client";

import { cn } from "@/lib/utils";
import { CheckCircle2, Circle } from "lucide-react";
import { PROBLEM_LIST } from "@/lib/dummy-data";
import Link from "next/link";

type DifficultyFilter = "All" | "Easy" | "Medium" | "Hard";

interface ProblemListProps {
  difficulty?: DifficultyFilter;
  search?: string;
}

function StatusIcon({ status }: { status?: string }) {
  if (status === "SOLVED") {
    return <CheckCircle2 size={15} className="text-emerald-500 shrink-0" />;
  }
  if (status === "ATTEMPTED") {
    return (
      <Circle size={15} className="text-amber-500 fill-amber-500/20 shrink-0" />
    );
  }
  return <Circle size={15} className="text-muted-foreground/15 shrink-0" />;
}

export function ProblemList({ difficulty = "All", search = "" }: ProblemListProps) {
  const filtered = PROBLEM_LIST.filter((p) => {
    const matchesDifficulty =
      difficulty === "All" ||
      p.difficulty.toLowerCase() === difficulty.toLowerCase();

    const matchesSearch =
      !search ||
      p.title.toLowerCase().includes(search.toLowerCase()) ||
      p.tags.some((t) => t.name.toLowerCase().includes(search.toLowerCase()));

    return matchesDifficulty && matchesSearch;
  });

  if (filtered.length === 0) {
    return (
      <div className="surface-card rounded-xl p-12 text-center">
        <p className="text-sm text-muted-foreground">No problems match your filters.</p>
      </div>
    );
  }

  return (
    <div className="surface-card rounded-xl overflow-hidden">
      <div className="hidden sm:grid sm:grid-cols-[50px_1fr_90px_140px_70px] items-center px-4 py-2.5 text-[10px] font-semibold uppercase tracking-[0.08em] text-muted-foreground/60 border-b border-border bg-muted/20">
        <span>Status</span>
        <span>Title</span>
        <span>Difficulty</span>
        <span>Tags</span>
        <span className="text-right">AC Rate</span>
      </div>

      {filtered.map((problem) => (
        <Link
          key={problem.id}
          prefetch={false}
          href={`/problems/${problem.slug}`}
          className="group flex flex-wrap gap-2 items-center sm:grid sm:grid-cols-[50px_1fr_90px_140px_70px] sm:items-center sm:gap-0 px-4 py-3 sm:py-2.5 border-b border-border last:border-0 hover:bg-muted/30 dark:hover:bg-white/[0.03] transition-colors"
        >
          <div className="flex items-center gap-3 sm:contents w-full">
            <StatusIcon status={problem.status} />
            <span className="text-[13px] font-medium text-foreground truncate group-hover:text-primary transition-colors">
              {problem.title}
            </span>
          </div>

          <span
            className={cn(
              "text-[11px] font-medium",
              problem.difficulty === "EASY" && "text-emerald-500",
              problem.difficulty === "MEDIUM" && "text-amber-500",
              problem.difficulty === "HARD" && "text-rose-500"
            )}
          >
            {problem.difficulty[0] + problem.difficulty.slice(1).toLowerCase()}
          </span>

          <div className="flex items-center gap-1.5 overflow-x-auto w-3/5 sm:w-full truncate [scrollbar-width:none]">
            {problem.tags?.slice(0, 2).map((tag) => (
              <span
                key={tag.id}
                className="text-[10px] text-muted-foreground/70 bg-muted px-2 py-0.5 rounded-md shrink-0"
              >
                {tag.name}
              </span>
            ))}
          </div>

          <span className="ml-auto text-[11px] text-muted-foreground font-mono text-right tabular-nums">
            {problem.submitCount > 0
              ? Math.round((problem.acceptedCount / problem.submitCount) * 100)
              : 0}
            %
          </span>
        </Link>
      ))}
    </div>
  );
}
