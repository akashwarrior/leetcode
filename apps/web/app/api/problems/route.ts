import { type NextRequest, NextResponse } from "next/server";
import { problemSelect } from "@/lib/db/queries";
import { Difficulty, prisma, ProblemStatus } from "@codearena/db";
import { auth } from "@/lib/auth";

export async function GET(req: NextRequest) {
  const searchParams = req.nextUrl.searchParams;
  const skip = Math.max(0, parseInt(searchParams.get("skip") ?? "0"));
  const take = Math.min(
    Math.max(1, parseInt(searchParams.get("limit") ?? "20")),
    50,
  );
  const difficultyParam = searchParams.get("difficulty");
  const difficulty =
    difficultyParam && difficultyParam in Difficulty
      ? (difficultyParam as Difficulty)
      : null;
  const tags = searchParams.getAll("tags");
  const search = searchParams.get("search") ?? null;

  const [problems, session] = await Promise.all([
    prisma.problem.findMany({
      where: {
        ...(difficulty && difficulty in Difficulty && { difficulty }),
        ...(tags.length && {
          AND: tags.map((tag) => ({
            tags: {
              some: {
                name: tag,
              },
            },
          })),
        }),
        ...(search && {
          title: {
            mode: "insensitive",
            contains: search,
          },
        }),
      },
      orderBy: [{ title: "asc" }],
      skip,
      take,
      select: problemSelect,
    }),

    auth.api.getSession({
      headers: req.headers,
    }),
  ]);

  if (session?.user) {
    const userProblems = await prisma.userProblem.findMany({
      where: {
        userId: session.user.id,
        problemId: {
          in: problems.map((p) => p.id),
        },
      },
      select: {
        problemId: true,
        status: true,
      },
    });

    const userProblemsMap = new Map<string, ProblemStatus>();
    userProblems.forEach((p) => {
      userProblemsMap.set(p.problemId, p.status);
    });

    return NextResponse.json(
      problems.map((p) => ({
        ...p,
        status: userProblemsMap.get(p.id),
      })),
    );
  }

  return NextResponse.json(problems);
}
