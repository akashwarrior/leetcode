import { prisma, type Difficulty, type ProblemStatus } from "./";

const DIFFICULTIES: Difficulty[] = ["EASY", "MEDIUM", "HARD"];

const TAGS = [
  "Array",
  "Hash Table",
  "Dynamic Programming",
  "String",
  "Math",
  "Tree",
  "Graph",
  "Sliding Window",
  "Two Pointers",
  "Binary Search",
] as const;

const SLUGS = [
  "two-sum",
  "group-anagrams",
  "coin-change",
  "product-of-array-except-self",
  "course-schedule",
  "minimum-window-substring",
  "median-of-two-sorted-arrays",
  "trapping-rain-water",
] as const;

const PROBLEM_COUNT = 30;
const CONTEST_COUNT = 5;
const PROBLEMS_PER_CONTEST = 4;
const ACTIVITY_DAYS = 180;

function utcMidnight(daysFromToday = 0): Date {
  const date = new Date();
  date.setUTCHours(0, 0, 0, 0);
  date.setUTCDate(date.getUTCDate() + daysFromToday);
  return date;
}

function pickRandom<T>(items: T[]): T {
  return items[Math.floor(Math.random() * items.length)]!;
}

function randomInt(max: number): number {
  return Math.floor(Math.random() * max);
}

async function seedTags() {
  await prisma.tag.createMany({
    data: TAGS.map((name) => ({ name })),
  });

  return prisma.tag.findMany({
    select: { id: true, name: true },
  });
}

async function seedProblems(
  tags: { id: string; name: string }[],
  count = PROBLEM_COUNT,
) {
  const creates = Array.from({ length: count }, (_, i) => {
    const index = i + 1;
    return prisma.problem.create({
      data: {
        slug: `${SLUGS[i % SLUGS.length]!}-${index}`,
        title: `Problem title ${index}`,
        description: `Description for problem ${index}`,
        difficulty: pickRandom(DIFFICULTIES),
        isHidden: false,
        timeLimitMs: 2000,
        memoryLimitKb: 262_144,
        defaultCodeSnippet: "https://google.com",
        testCases: JSON.stringify([
          { input: "sample input 1", output: "sample output 1", isHidden: false },
          { input: "sample input 2", output: "sample output 2", isHidden: true },
        ]),
        hints: ["Hint 1", "Hint 2"],
        totalSubmissions: randomInt(1000),
        totalAccepted: randomInt(1000),
        tags: {
          connect: tags
            .filter(() => Math.random() > 0.5)
            .map((tag) => ({ id: tag.id })),
        },
        createdAt: utcMidnight(i),
      },
      select: { id: true, slug: true },
    });
  });

  return Promise.all(creates);
}

async function seedDailyProblems(problemIds: string[]) {
  return prisma.problemOfTheDay.createMany({
    data: problemIds.map((problemId, i) => ({
      date: utcMidnight(i),
      problemId,
    })),
  });
}

async function seedContests(
  problemIds: string[],
  count = CONTEST_COUNT,
) {
  for (let i = 0; i < count; i++) {
    const startTime = new Date();
    startTime.setUTCMinutes(0, 0, 0);
    startTime.setUTCDate(startTime.getUTCDate() + i);
    startTime.setUTCHours(15);

    const endTime = new Date(startTime);
    endTime.setUTCMinutes(endTime.getUTCMinutes() + 90);

    const contest = await prisma.contest.create({
      data: {
        slug: `contest-${i}`,
        title: `Contest title ${i}`,
        description: `Description for contest ${i}`,
        startTime,
        endTime,
        isHidden: false,
      },
      select: { id: true },
    });

    const slice = problemIds.slice(
      i * PROBLEMS_PER_CONTEST,
      (i + 1) * PROBLEMS_PER_CONTEST,
    );

    await prisma.contestProblem.createMany({
      data: slice.map((problemId, index) => ({
        contestId: contest.id,
        problemId,
        order: String.fromCharCode(65 + index),
        points: (index + 1) * 3,
      })),
    });
  }
}

async function seedDemoUser(problemBySlug: Map<string, string>) {
  const user = await prisma.user.create({
    data: {
      id: "seed-demo-user",
      name: "Demo User",
      email: "demo@codearena.dev",
      username: "demo_user",
      role: "USER",
      streak: 12,
      globalRank: 1842,
      rating: 1675,
      solvedEasy: 2,
      solvedMedium: 3,
      solvedHard: 0,
    },
    select: { id: true },
  });

  const userProblems: {
    userId: string;
    problemId: string;
    status: ProblemStatus;
  }[] = [];

  for (const [, problemId] of problemBySlug) {
    userProblems.push({
      userId: user.id,
      problemId,
      status: Math.random() < 0.5 ? "SOLVED" : "ATTEMPTED",
    });
  }

  if (userProblems.length > 0) {
    await prisma.userProblem.createMany({ data: userProblems });
  }

  const activity = Array.from({ length: ACTIVITY_DAYS }, (_, index) => {
    const dayOffset = ACTIVITY_DAYS - 1 - index;
    const weekday = index % 7;
    const recentBoost = index > 130 ? 2 : index > 90 ? 1 : 0;
    const base = weekday < 5 ? 1 : 0;
    const submissionCount = Math.min(
      4,
      base + recentBoost + (index % 4 === 0 ? 1 : 0),
    );

    return {
      userId: user.id,
      date: utcMidnight(-dayOffset),
      submissionCount,
    };
  }).filter((entry) => entry.submissionCount > 0);

  if (activity.length > 0) {
    await prisma.activity.createMany({ data: activity });
  }
}

async function clearDatabase() {
  await prisma.activity.deleteMany();
  await prisma.userProblem.deleteMany();
  await prisma.problemOfTheDay.deleteMany();
  await prisma.contestProblem.deleteMany();
  await prisma.contest.deleteMany();
  await prisma.problem.deleteMany();
  await prisma.tag.deleteMany();
  await prisma.user.deleteMany();
}

async function main() {
  console.log("🗑️  Clearing database…");
  await clearDatabase();

  console.log("🏷️  Seeding tags…");
  const tags = await seedTags();

  console.log(`📝 Seeding ${PROBLEM_COUNT} problems…`);
  const problems = await seedProblems(tags);

  const problemIds = problems.map((p) => p.id);
  const problemBySlug = new Map(problems.map((p) => [p.slug, p.id]));

  console.log("📅 Seeding daily problems…");
  await seedDailyProblems(problemIds);

  console.log(`🏆 Seeding ${CONTEST_COUNT} contests…`);
  await seedContests(problemIds);

  console.log("👤 Seeding demo user…");
  await seedDemoUser(problemBySlug);

  const contestCount = await prisma.contest.count();
  console.log(
    `✅ Seeded ${problems.length} problems, ${contestCount} contests, and demo user progress.`,
  );
}

main()
  .catch((error) => {
    console.error("❌ Seed failed:", error);
    process.exitCode = 1;
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
