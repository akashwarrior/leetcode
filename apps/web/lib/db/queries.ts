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
    const grouped = await prisma.problem.groupBy({
      by: ["difficulty"],
      where: { isHidden: false },
      _count: { _all: true },
    });

    const byDifficulty = new Map(
      grouped.map((g) => [g.difficulty, g._count._all]),
    );

    const easy = byDifficulty.get("EASY") ?? 0;
    const medium = byDifficulty.get("MEDIUM") ?? 0;
    const hard = byDifficulty.get("HARD") ?? 0;

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
      orderBy: { name: "asc" },
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

export const getUserActivityHeatmap = unstable_cache(
  (userId: string) => {
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
  },
  ["user-activity-heatmap"],
  { tags: ["activity"] },
);

const CONTEST_LIST_LIMIT = 15;

export const getCachedContestList = unstable_cache(
  async () => {
    const contests = await prisma.contest.findMany({
      where: { isHidden: false },
      orderBy: { startTime: "desc" },
      take: CONTEST_LIST_LIMIT,
      select: {
        id: true,
        slug: true,
        title: true,
        startTime: true,
        endTime: true,
        _count: {
          select: {
            problems: true,
            participations: true,
          },
        },
      },
    });

    return contests.map((c) => ({
      ...c,
      startTime: c.startTime.toISOString(),
      endTime: c.endTime.toISOString(),
    }));
  },
  ["contest-list"],
  { tags: ["contests"] },
);

export const getCachedTopUsers = unstable_cache(
  async () => {
    return prisma.user.findMany({
      orderBy: [{ rating: "desc" }, { username: "asc" }],
      take: 5,
      select: {
        username: true,
        rating: true,
        globalRank: true,
      },
    });
  },
  ["top-users"],
  { tags: ["users"] },
);

export const getCachedContestDetail = unstable_cache(
  async (contestIdOrSlug: string) => {
    const contest = await prisma.contest.findFirst({
      where: {
        isHidden: false,
        OR: [{ id: contestIdOrSlug }, { slug: contestIdOrSlug }],
      },
      select: {
        id: true,
        slug: true,
        title: true,
        description: true,
        startTime: true,
        endTime: true,
        _count: {
          select: {
            problems: true,
            participations: true,
          },
        },
        problems: {
          orderBy: { order: "asc" },
          select: {
            order: true,
            points: true,
            problem: {
              select: {
                id: true,
                slug: true,
                title: true,
                difficulty: true,
              },
            },
          },
        },
      },
    });

    if (!contest) return null;

    return {
      ...contest,
      startTime: contest.startTime.toISOString(),
      endTime: contest.endTime.toISOString(),
    };
  },
  ["contest-detail"],
  { tags: ["contests"] },
);

export const getCachedContestLeaderboard = unstable_cache(
  async (contestId: string) => {
    return prisma.contestParticipation.findMany({
      where: { contestId },
      orderBy: [{ score: "desc" }, { penalty: "asc" }, { registeredAt: "asc" }],
      take: 20,
      select: {
        rank: true,
        score: true,
        penalty: true,
        user: {
          select: {
            username: true,
          },
        },
      },
    });
  },
  ["contest-leaderboard"],
  { tags: ["contests"] },
);

export const getCachedUserProfile = unstable_cache(
  async (username: string) => {
    return prisma.user.findFirst({
      where: { username },
      select: {
        id: true,
        name: true,
        username: true,
        image: true,
        streak: true,
        githubUrl: true,
        rating: true,
        globalRank: true,
        solvedEasy: true,
        solvedMedium: true,
        solvedHard: true,
        _count: {
          select: {
            participations: true,
          },
        },
      },
    });
  },
  ["user-profile"],
  { tags: ["users"], revalidate: 60 * 60 },
);
