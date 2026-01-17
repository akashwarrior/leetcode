import { ArrowRightIcon } from "lucide-react";
import { ProblemList } from "@/components/problem-list";
import { getCachedInitialProblemPage } from "@/lib/db/queries";
import { auth } from "@/lib/auth";
import { headers } from "next/headers";
import { prisma, type ProblemStatus } from "@codearena/db";
import { SWRConfig } from "swr";
import { unstable_serialize } from "swr/infinite";
import { getProblemsKey } from "@/lib/problems-keys";

type ProblemCategory = {
  id: string;
  title: string;
  description: string;
  slug: string;
};

const PROBLEM_CATEGORIES: ProblemCategory[] = [
  {
    id: "1",
    title: "Top Interview 150",
    description: "Must-do list for interview prep",
    slug: "top-interview-150",
  },
  {
    id: "2",
    title: "Dynamic Programming",
    description: "Master DP patterns",
    slug: "dynamic-programming",
  },
  {
    id: "3",
    title: "Graph Algorithms",
    description: "BFS, DFS, Shortest Path",
    slug: "graph",
  },
  {
    id: "4",
    title: "Beginner Topics",
    description: "Arrays, Strings, Linked Lists",
    slug: "beginner",
  },
] as const;

async function getProblems() {
  const [baseProblems, session] = await Promise.all([
    getCachedInitialProblemPage(),
    auth.api.getSession({ headers: await headers() }),
  ]);

  const userId = session?.user?.id;
  const userProblemsMap = new Map<string, ProblemStatus>();
  if (userId) {
    const userProblems = await prisma.userProblem.findMany({
      where: {
        userId,
        problem: {
          id: {
            in: baseProblems.map((p) => p.id),
          },
        },
      },
      select: { problemId: true, status: true },
    });
    userProblems.forEach((p) => userProblemsMap.set(p.problemId, p.status));
  }

  return [
    baseProblems.map((p) => ({
      ...p,
      status: userProblemsMap.get(p.id),
    })),
  ];
}

const fallbackValue = {
  fallback: {
    [unstable_serialize(getProblemsKey())]: getProblems(),
  },
} as const;

export default function ProblemsPage() {
  return (
    <div className="pb-12 min-h-svh">
      <div className="mb-8">
        <h1 className="text-xl font-medium tracking-tight">Problems</h1>
        <p className="mt-1 text-sm text-muted-foreground">
          Master algorithms, one problem at a time.
        </p>
      </div>

      <div className="mb-6 flex gap-3 overflow-x-auto">
        {PROBLEM_CATEGORIES.map((category) => (
          <div
            key={category.id}
            className="group surface-card rounded-xl p-4 transition-colors duration-150 hover:border-foreground/10 min-w-50 flex-1"
          >
            <div className="flex items-center justify-between mb-1.5">
              <p className="text-sm font-medium truncate">{category.title}</p>
              <ArrowRightIcon
                size={16}
                className="text-muted-foreground -rotate-45 group-hover:rotate-0 group-hover:text-foreground transition-all duration-150"
              />
            </div>
            <p className="text-xs text-muted-foreground mb-2.5 leading-relaxed truncate">
              {category.description}
            </p>
            <div className="flex items-center gap-2 text-xs text-muted-foreground">
              <span className="font-mono tabular-nums">(Coming Soon)</span>
            </div>
          </div>
        ))}
      </div>

      <SWRConfig value={fallbackValue}>
        <ProblemList />
      </SWRConfig>
    </div>
  );
}
