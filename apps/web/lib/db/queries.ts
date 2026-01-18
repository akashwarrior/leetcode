import type { ProblemTotals, UpcomingContest } from "@/types";
import { prisma, type Tag } from "@codearena/db";
import { unstable_cache } from "next/cache";
import { DEFAULT_PAGE_SIZE } from "../problems-keys";

export const problemSelect = {
  id: true,
  slug: true,
  title: true,
  difficulty: true,
  totalAccepted: true,
  totalSubmissions: true,
  tags: true,
} as const;

export const getCachedInitialProblemPage = unstable_cache(
  () =>
    prisma.problem.findMany({
      where: { isHidden: false },
      orderBy: [{ title: "asc" }],
      take: DEFAULT_PAGE_SIZE,
      select: problemSelect,
    }),
  ["initial-problems-page"],
  { tags: ["problems"] },
);

export const getRecentProblems = unstable_cache(
  (userId: string) =>
    prisma.userProblem.findMany({
      where: {
        userId,
      },
      orderBy: {
        createdAt: "desc",
      },
      take: 6,
      select: {
        status: true,
        problem: {
          select: {
            ...problemSelect,
          },
        },
      },
    }),
  ["recent-problems"],
  { tags: ["problems"] },
);

export const getProblemTotals = unstable_cache(
  async (): Promise<ProblemTotals> => {
    const [easy, medium, hard] = await Promise.all([
      prisma.problem.count({
        where: {
          isHidden: false,
          difficulty: "EASY",
        },
      }),
      prisma.problem.count({
        where: {
          isHidden: false,
          difficulty: "MEDIUM",
        },
      }),
      prisma.problem.count({
        where: {
          isHidden: false,
          difficulty: "HARD",
        },
      }),
    ]);

    return { easy, medium, hard, total: easy + medium + hard };
  },
  ["problem-totals"],
  { tags: ["problems"] },
);

export const getProblemTags = unstable_cache(
  async (): Promise<Tag[]> => {
    return prisma.tag.findMany({
      select: {
        id: true,
        name: true,
      },
      take: 10,
    });
  },
  ["problem-tags"],
  { tags: ["problems"] },
);

export const getDailyProblem = unstable_cache(
  () => {
    const today = new Date();
    today.setUTCHours(0, 0, 0, 0);

    return prisma.problemOfTheDay.findUnique({
      where: {
        date: today,
      },
      select: {
        problem: {
          select: problemSelect,
        },
      },
    });
  },
  ["daily-problem"],
  { tags: ["problems"] },
);

export const getUpcomingContests = unstable_cache(
  async (): Promise<UpcomingContest[]> => {
    const contests = await prisma.contest.findMany({
      where: {
        isHidden: false,
        startTime: {
          gt: new Date(),
        },
      },
      orderBy: {
        startTime: "asc",
      },
      take: 2,
      select: {
        id: true,
        title: true,
        startTime: true,
        _count: {
          select: {
            problems: true,
          },
        },
      },
    });

    return contests.map((contest) => ({
      id: contest.id,
      title: contest.title,
      startTime: contest.startTime,
      problemCount: contest._count.problems,
    }));
  },
  ["upcoming-contests"],
  { tags: ["contests"] },
);

export function getUserActivityHeatmap(userId: string) {
  const today = new Date();
  today.setUTCHours(0, 0, 0, 0);

  const start = new Date(today);
  start.setUTCDate(start.getUTCDate() - 364);

  return prisma.activity.findMany({
    where: {
      userId,
      date: {
        gte: start,
      },
    },
    orderBy: {
      date: "asc",
    },
    select: {
      date: true,
      submissionCount: true,
    },
  });
}

export async function getHomePageData(userId: string) {
  const [
    dailyProblem,
    recentProblems,
    problemTotals,
    upcomingContests,
    tags,
    activity,
  ] = await Promise.all([
    getDailyProblem(),
    getRecentProblems(userId),
    getProblemTotals(),
    getUpcomingContests(),
    getProblemTags(),
    getUserActivityHeatmap(userId),
  ]);

  return {
    dailyProblem: { ...dailyProblem?.problem, status: "SOLVED" },
    recentProblems: recentProblems.map(({ problem, status }) => ({
      ...problem,
      status,
    })),
    problemTotals,
    upcomingContests,
    tags,
    activity,
  };
}
