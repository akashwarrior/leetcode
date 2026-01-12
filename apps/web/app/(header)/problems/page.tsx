"use client";

import { cn } from "@/lib/utils";
import { useState } from "react";
import {
  ArrowRightIcon,
  SearchIcon,
  Target,
  Flame,
  Trophy,
  ChevronRight,
  X,
} from "lucide-react";
import { PROBLEM_CATEGORIES, PROBLEM_LIST } from "@/lib/dummy-data";
import { ProblemList } from "@/components/problem-list";
import { AnimatedBackground } from "@/components/ui/animated-background";
import {
  InputGroup,
  InputGroupAddon,
  InputGroupInput,
} from "@/components/ui/input-group";
import Link from "next/link";

const DIFFICULTY_OPTIONS = ["All", "Easy", "Medium", "Hard"] as const;
type DifficultyFilter = (typeof DIFFICULTY_OPTIONS)[number];


export default function ProblemsPage() {
  const [difficulty, setDifficulty] = useState<DifficultyFilter>("All");
  const [search, setSearch] = useState("");

  const filteredCount = PROBLEM_LIST.filter((p) => {
    const matchesDifficulty =
      difficulty === "All" ||
      p.difficulty.toLowerCase() === difficulty.toLowerCase();
    const matchesSearch =
      !search ||
      p.title.toLowerCase().includes(search.toLowerCase()) ||
      p.tags.some((t) => t.name.toLowerCase().includes(search.toLowerCase()));
    return matchesDifficulty && matchesSearch;
  }).length;

  return (
    <div className="pb-12">
      <div className="mb-8">
        <h1 className="text-xl font-medium tracking-tight">Problems</h1>
        <p className="mt-1 text-sm text-muted-foreground">
          Master algorithms, one problem at a time.
        </p>
      </div>

      <div className="mb-6 grid gap-3 grid-cols-2 sm:grid-cols-4">
        {PROBLEM_CATEGORIES.slice(0, 4).map((cat) => (
          <Link
            key={cat.id}
            prefetch={false}
            href={`/problems?category=${cat.id}`}
            className="group surface-card rounded-xl p-4 transition-colors duration-150 hover:border-foreground/10 dark:hover:border-white/12"
          >
            <div className="flex items-center justify-between mb-1.5">
              <p className="text-sm font-medium">{cat.title}</p>
              <ArrowRightIcon
                size={16}
                className="text-muted-foreground -rotate-45 group-hover:rotate-0 group-hover:text-foreground transition-all duration-150"
              />
            </div>
            <p className="text-xs text-muted-foreground line-clamp-2 mb-2.5 leading-relaxed">
              {cat.description}
            </p>
            <div className="flex items-center gap-2 text-xs text-muted-foreground">
              <span className="font-mono tabular-nums">{cat.problemCount}</span>
              {cat.difficulty && (
                <span
                  className={cn(
                    "font-medium",
                    cat.difficulty === "EASY" && "text-emerald-500",
                    cat.difficulty === "MEDIUM" && "text-amber-500",
                    cat.difficulty === "HARD" && "text-rose-500"
                  )}
                >
                  {cat.difficulty.toLowerCase()}
                </span>
              )}
            </div>
          </Link>
        ))}
      </div>

      {/* Filter bar */}
      <div className="mb-4 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div className="flex items-center gap-3">
          <h2 className="text-sm font-medium">All Problems</h2>
          <span className="text-[11px] text-muted-foreground font-mono bg-muted px-2 py-0.5 rounded tabular-nums">
            {filteredCount}
          </span>
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
              onValueChange={(v) => setDifficulty(v as DifficultyFilter)}
              className="bg-muted rounded-md"
              transition={{ ease: "easeInOut", duration: 0.15 }}
            >
              {DIFFICULTY_OPTIONS.map((d) => (
                <button
                  key={d}
                  data-id={d}
                  className={cn(
                    "inline-flex h-7 items-center px-3 text-xs font-medium transition-colors rounded-md",
                    difficulty !== d && "text-muted-foreground hover:text-foreground"
                  )}
                >
                  {d}
                </button>
              ))}
            </AnimatedBackground>
          </div>
        </div>
      </div>

      {/* Mobile search */}
      <div className="mb-4 sm:hidden">
        <InputGroup className="w-full rounded-lg">
          <InputGroupInput
            placeholder="Search problems..."
            className="text-sm h-9"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />
          <InputGroupAddon>
            {search ? (
              <button
                onClick={() => setSearch("")}
                className="text-muted-foreground hover:text-foreground transition-colors"
              >
                <X size={14} />
              </button>
            ) : (
              <SearchIcon size={14} className="text-muted-foreground" />
            )}
          </InputGroupAddon>
        </InputGroup>
      </div>

      <ProblemList difficulty={difficulty} search={search} />
    </div>
  );
}
