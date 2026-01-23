"use client";

import type { DifficultyFilter } from "@/lib/types";
import Link from "next/link";
import { motion } from "motion/react";
import { cn } from "@/lib/utils";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { useProblems } from "@/hooks/use-problems";
import {
  InputGroup,
  InputGroupAddon,
  InputGroupInput,
} from "@/components/ui/input-group";
import {
  CheckCircleIcon,
  CircleIcon,
  SpinnerIcon,
  MagnifyingGlassIcon,
  XIcon,
} from "@phosphor-icons/react";

const DIFFICULTY_OPTIONS: DifficultyFilter[] = [
  "ALL",
  "EASY",
  "MEDIUM",
  "HARD",
];

function StatusIcon({ status }: { status?: string }) {
  if (status === "SOLVED") {
    return (
      <CheckCircleIcon weight="regular" size={15} className="status-success" />
    );
  }
  if (status === "ATTEMPTED") {
    return <CircleIcon weight="regular" size={15} className="status-warning" />;
  }
  return <CircleIcon weight="regular" size={15} className="text-disabled/30" />;
}

export function ProblemList({ initialTags }: { initialTags?: string[] }) {
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
  } = useProblems({ initialTags });

  return (
    <>
      <div className="mb-4 flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        <div className="flex flex-wrap items-center gap-2">
          <h2 className="font-mono-label text-xs tracking-wider text-secondary">
            PROBLEMS
          </h2>
          <span className="font-mono-label text-[10px] text-disabled tabular-nums">
            {problems?.length}
          </span>
          {isLoading && (
            <SpinnerIcon size={12} className="animate-spin text-secondary" />
          )}
          {tags.length
            ? tags.map((tag) => (
                <button
                  key={tag}
                  type="button"
                  onClick={() => setTags(tags.filter((t) => t !== tag))}
                  className="inline-flex items-center gap-1 rounded border border-border bg-background px-2 py-0.5 font-mono-label text-[10px] text-secondary transition-colors duration-150 ease-out hover:text-primary"
                >
                  {tag.toUpperCase()}
                  <XIcon weight="regular" size={12} />
                </button>
              ))
            : null}
        </div>

        <div className="flex items-center gap-3">
          <div className="relative hidden sm:block">
            <InputGroup className="w-52 rounded-lg border border-border bg-background">
              <InputGroupInput
                type="search"
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                placeholder="Search..."
                className="text-sm h-8 placeholder:text-disabled"
              />
              <InputGroupAddon>
                <MagnifyingGlassIcon
                  weight="regular"
                  size={14}
                  className="text-secondary"
                />
              </InputGroupAddon>
            </InputGroup>
          </div>

          <div className="inline-flex items-center rounded-lg bg-muted p-0.5">
            {DIFFICULTY_OPTIONS.map((option) => (
              <button
                key={option}
                type="button"
                onClick={() => setDifficulty(option)}
                className={cn(
                  "inline-flex h-7 items-center px-2.5 text-xs font-medium rounded-md transition-colors duration-150 ease-out",
                  difficulty !== option
                    ? "text-secondary hover:text-primary"
                    : "bg-background text-primary",
                )}
              >
                {option}
              </button>
            ))}
          </div>
        </div>
      </div>

      <div className="mb-4 sm:hidden">
        <InputGroup className="w-full rounded border border-border bg-background">
          <InputGroupInput
            type="search"
            placeholder="Search..."
            className="text-sm h-9 placeholder:text-disabled"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />
          <InputGroupAddon>
            <MagnifyingGlassIcon
              weight="regular"
              size={14}
              className="text-secondary"
            />
          </InputGroupAddon>
        </InputGroup>
      </div>

      {!problems || problems.length === 0 ? (
        !isLoading ? (
          <div className="nothing-card rounded-lg p-10 text-center">
            <p className="text-sm text-secondary">
              No problems match your filters.
            </p>
          </div>
        ) : (
          <div className="nothing-card rounded-lg p-10 text-center">
            <p className="font-mono-label text-xs text-secondary">
              [LOADING...]
            </p>
          </div>
        )
      ) : (
        <div className="nothing-card rounded-lg overflow-hidden">
          <div className="hidden sm:grid sm:grid-cols-[50px_1fr_90px_200px_60px] items-center px-4 py-2 font-mono-label text-[10px] text-secondary/60 border-b border-border bg-muted/20">
            <span>Status</span>
            <span>Title</span>
            <span>Difficulty</span>
            <span>Tags</span>
            <span className="text-right">AC Rate</span>
          </div>

          {problems.map((problem) => (
            <div key={problem.id}>
              <Link
                prefetch={false}
                href={`/problems/${problem.slug}`}
                className="group flex flex-wrap gap-2 items-center sm:grid sm:grid-cols-[50px_1fr_90px_200px_60px] sm:items-center sm:gap-0 px-4 py-2.5 border-b border-border last:border-0 transition-colors duration-150 ease-out hover:bg-muted/30"
              >
                <div className="flex items-center gap-3 sm:contents w-full">
                  <StatusIcon status={problem.status} />
                  <span className="text-[13px] font-medium text-primary truncate transition-colors duration-150 ease-out group-hover:text-primary">
                    {problem.title}
                  </span>

                  <span
                    className={cn(
                      "text-[11px] font-medium capitalize sm:hidden",
                      problem.difficulty === "EASY" && "status-success",
                      problem.difficulty === "MEDIUM" && "status-warning",
                      problem.difficulty === "HARD" && "status-error",
                    )}
                  >
                    {problem.difficulty?.toLowerCase()}
                  </span>
                </div>

                <span
                  className={cn(
                    "text-[11px] font-medium capitalize hidden sm:flex",
                    problem.difficulty === "EASY" && "status-success",
                    problem.difficulty === "MEDIUM" && "status-warning",
                    problem.difficulty === "HARD" && "status-error",
                  )}
                >
                  {problem.difficulty?.toLowerCase()}
                </span>

                <div className="flex items-center gap-1.5 overflow-x-auto ml-6 sm:ml-0 flex-1 [scrollbar-width:none]">
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

                <span className="ml-4 sm:ml-auto text-[11px] text-secondary font-mono text-right tabular-nums">
                  {problem.totalSubmissions > 0
                    ? Math.round(
                        (problem.totalAccepted / problem.totalSubmissions) *
                          100,
                      )
                    : 0}
                  %
                </span>
              </Link>
            </div>
          ))}

          <motion.div onViewportEnter={loadMore} />

          {isLoading &&
            Array.from({ length: 5 }).map((_, i) => (
              <div key={i} className="min-h-10">
                <div className="sm:grid flex gap-3 sm:gap-0 flex-wrap sm:grid-cols-[50px_1fr_90px_200px_60px] items-center px-4 py-2">
                  <div className="bg-muted rounded-full size-4 animate-pulse" />
                  <div className="h-4 bg-muted rounded w-3/4 animate-pulse" />
                  <div className="h-4 bg-muted rounded w-12 animate-pulse" />
                  <div className="flex gap-1.5">
                    <div className="h-4 bg-muted rounded w-12 animate-pulse" />
                    <div className="h-4 bg-muted rounded w-16 animate-pulse" />
                  </div>
                  <div className="h-4 bg-muted rounded w-8 ml-auto animate-pulse" />
                </div>
              </div>
            ))}
        </div>
      )}

      {error && (
        <div className="nothing-card rounded-lg p-10 text-center">
          <p className="text-sm text-secondary">Could not load problems.</p>
          <Button
            type="button"
            variant="outline"
            size="sm"
            onClick={() => mutate()}
            className="mt-3"
          >
            Retry
          </Button>
        </div>
      )}
    </>
  );
}
