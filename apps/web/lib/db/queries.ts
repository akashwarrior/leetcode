import { prisma } from "@codearena/db";
import { unstable_cache } from "next/cache";

export const PROBLEMS_PAGE_SIZE = 10;

export const problemSelect = {
  select: {
    id: true,
    slug: true,
    title: true,
    difficulty: true,
    totalAccepted: true,
    totalSubmissions: true,
    tags: true,
  },
} as const;

export const getCachedInitialProblemPage = unstable_cache(
  async () =>
    prisma.problem.findMany({
      where: { isHidden: false },
      orderBy: [{ title: "asc" }],
      take: PROBLEMS_PAGE_SIZE,
      ...problemSelect,
    }),
  ["initial-problems-page"],
  { tags: ["problems"] },
);