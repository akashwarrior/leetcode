"use client";

import type { DifficultyFilter } from "@/types";
import Link from "next/link";
import { cn } from "@/lib/utils";
import { motion } from "motion/react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { useProblems } from "@/hooks/use-problems";
import { AnimatedBackground } from "@/components/ui/animated-background";
import {
  InputGroup,
  InputGroupAddon,
  InputGroupInput,
} from "@/components/ui/input-group";
import {
  CheckCircle2,
  Circle,
  LoaderIcon,
  SearchIcon,
  XIcon,
} from "lucide-react";

const DIFFICULTY_OPTIONS: DifficultyFilter[] = [
  "ALL",
  "EASY",
  "MEDIUM",
  "HARD",
];

function StatusIcon({ status }: { status?: string }) {
  if (status === "SOLVED") {
    return <CheckCircle2 size={15} className="text-emerald-500" />;
  }
  if (status === "ATTEMPTED") {
    return <Circle size={15} className="text-amber-500 fill-amber-500/20" />;
  }
  return <Circle size={15} className="text-muted-foreground/15" />;
}

function SkeletonRow() {
  return (
    <div className="flex flex-wrap gap-2 items-center sm:grid sm:grid-cols-[50px_1fr_90px_140px_70px] sm:items-center sm:gap-0 px-4 py-3 sm:py-2.5 border-b border-border last:border-0 animate-pulse">
      <div className="flex items-center gap-3 sm:contents w-full">
        <div className="size-[15px] rounded-full bg-muted" />
        <div className="h-3.5 w-40 rounded bg-muted" />
      </div>
      <div className="h-3 w-12 rounded bg-muted" />
      <div className="flex items-center gap-1.5">
        <div className="h-5 w-14 rounded-full bg-muted" />
        <div className="h-5 w-10 rounded-full bg-muted" />
      </div>
      <div className="ml-auto h-3 w-8 rounded bg-muted" />
    </div>
  );
}

export function ProblemList() {
  const {
    difficulty,
    tags,
    setTags,
    search,
    setSearch,
    setDifficulty,
    problems,
    error,
    mutate,
    loadMore,
    isLoading,
  } = useProblems();

  return (
    <>
      <div className="mb-4 flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        <div className="flex flex-wrap items-center gap-2">
          <h2 className="text-sm font-medium">All Problems</h2>
          <span className="rounded-md bg-muted px-2 py-0.5 text-[11px] text-muted-foreground font-mono tabular-nums">
            {problems?.length}
          </span>
          {isLoading && (
            <LoaderIcon
              size={12}
              className="animate-spin text-muted-foreground"
            />
          )}
          {tags.length
            ? tags.map((tag) => (
                <button
                  key={tag}
                  type="button"
                  onClick={() => setTags(tags.filter((t) => t !== tag))}
                  className="inline-flex items-center gap-1 rounded-md border border-border bg-card px-2 py-1 text-[11px] text-muted-foreground transition-colors hover:text-foreground"
                >
                  {tag}
                  <XIcon size={12} />
                </button>
              ))
            : null}
        </div>

        <div className="flex items-center gap-3">
          <div className="relative hidden sm:block">
            <InputGroup className="w-56 rounded-lg">
              <InputGroupInput
                type="search"
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                placeholder="Search problems..."
                className="text-sm h-8"
              />
              <InputGroupAddon>
                <SearchIcon size={14} className="text-muted-foreground" />
              </InputGroupAddon>
            </InputGroup>
          </div>

          <div className="flex items-center rounded-lg border border-border bg-card p-0.5">
            <AnimatedBackground
              defaultValue={difficulty}
              onValueChange={(value) =>
                setDifficulty(value as DifficultyFilter)
              }
              className="bg-muted rounded-md"
              transition={{ ease: "easeInOut", duration: 0.15 }}
            >
              {DIFFICULTY_OPTIONS.map((option) => (
                <button
                  key={option}
                  data-id={option}
                  className={cn(
                    "inline-flex h-7 items-center px-3 text-xs font-medium transition-colors rounded-md",
                    difficulty !== option &&
                      "text-muted-foreground hover:text-foreground",
                  )}
                >
                  {option}
                </button>
              ))}
            </AnimatedBackground>
          </div>
        </div>
      </div>

      <div className="mb-4 sm:hidden">
        <InputGroup className="w-full rounded-lg">
          <InputGroupInput
            type="search"
            placeholder="Search problems..."
            className="text-sm h-9"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />
          <InputGroupAddon>
            <SearchIcon size={14} className="text-muted-foreground" />
          </InputGroupAddon>
        </InputGroup>
      </div>

      {!problems || problems.length === 0 ? (
        !isLoading ? (
          <div className="surface-card rounded-xl p-12 text-center">
            <p className="text-sm text-muted-foreground">
              No problems match your filters.
            </p>
          </div>
        ) : (
          Array.from({ length: 3 }).map((_, i) => (
            <SkeletonRow key={`skeleton-${i}`} />
          ))
        )
      ) : (
        <div className="surface-card rounded-xl overflow-hidden">
          <div className="hidden sm:grid sm:grid-cols-[50px_1fr_90px_140px_70px] items-center px-4 py-2.5 text-[10px] font-semibold uppercase tracking-[0.08em] text-muted-foreground/60 border-b border-border bg-muted/20">
            <span>Status</span>
            <span>Title</span>
            <span>Difficulty</span>
            <span>Tags</span>
            <span className="text-right">AC Rate</span>
          </div>

          {problems.map((problem) => (
            <Link
              key={problem.id}
              prefetch={false}
              href={`/problems/${problem.slug}`}
              className="group flex flex-wrap gap-2 items-center sm:grid sm:grid-cols-[50px_1fr_90px_140px_70px] sm:items-center sm:gap-0 px-4 py-3 sm:py-2.5 border-b border-border last:border-0 hover:bg-muted/30 transition-colors"
            >
              <div className="flex items-center gap-3 sm:contents w-full">
                <StatusIcon status={problem.status} />
                <span className="text-[13px] font-medium text-foreground truncate group-hover:text-primary transition-colors">
                  {problem.title}
                </span>
              </div>

              <span
                className={cn(
                  "text-[11px] font-medium capitalize",
                  problem.difficulty === "EASY" && "text-emerald-500",
                  problem.difficulty === "MEDIUM" && "text-amber-500",
                  problem.difficulty === "HARD" && "text-rose-500",
                )}
              >
                {problem.difficulty?.toLowerCase()}
              </span>

              <div className="flex items-center gap-1.5 overflow-x-auto w-3/5 sm:w-full [scrollbar-width:none]">
                {problem.tags?.map((tagItem) => (
                  <Badge
                    key={tagItem.id}
                    variant="secondary"
                    onClick={(e) => {
                      e.preventDefault();
                      setTags([
                        ...tags.filter((t) => t !== tagItem.name),
                        tagItem.name,
                      ]);
                    }}
                    className="text-[10px]"
                  >
                    {tagItem.name}
                  </Badge>
                ))}
              </div>

              <span className="ml-auto text-[11px] text-muted-foreground font-mono text-right tabular-nums">
                {problem.totalSubmissions > 0
                  ? Math.round(
                      (problem.totalAccepted / problem.totalSubmissions) * 100,
                    )
                  : 0}
                %
              </span>
            </Link>
          ))}

          {error && (
            <div className="surface-card rounded-xl p-12 text-center">
              <p className="text-sm text-muted-foreground">
                Could not load problems.
              </p>
              <Button
                type="button"
                variant="outline"
                size="sm"
                onClick={() => mutate()}
                className="mt-4"
              >
                Retry
              </Button>
            </div>
          )}

          <motion.div onViewportEnter={loadMore} />
        </div>
      )}
    </>
  );
}
