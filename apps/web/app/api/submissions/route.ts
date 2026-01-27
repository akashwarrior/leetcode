import { type Prisma, Language, prisma } from "@codearena/db";
import { type NextRequest, NextResponse } from "next/server";
import { auth } from "@/lib/auth";
import { redisService } from "@codearena/redis";

const submissionListSelect: Prisma.SubmissionSelect = {
  id: true,
  language: true,
  status: true,
  timeInMs: true,
  memoryInKb: true,
  errorMessage: true,
  code: true,
  codeOutput: true,
  createdAt: true,
} as const;

export async function GET(req: NextRequest) {
  const problemId = req.nextUrl.searchParams.get("problemId");

  if (!problemId) {
    return NextResponse.json(
      { message: "problemId is required" },
      { status: 400 },
    );
  }

  const session = await auth.api.getSession({ headers: req.headers });

  if (!session?.user) {
    return NextResponse.json([]);
  }

  const limitParam = Number.parseInt(
    req.nextUrl.searchParams.get("limit") ?? String(20),
    10,
  );
  const take = Math.min(Math.max(1, limitParam), 50);

  const submissions = await prisma.submission.findMany({
    where: {
      problemId,
      userId: session.user.id,
    },
    orderBy: {
      createdAt: "desc",
    },
    take,
    select: submissionListSelect,
  });

  return NextResponse.json(submissions);
}

export async function POST(req: NextRequest) {
  const session = await auth.api.getSession({ headers: req.headers });

  if (!session?.user) {
    return NextResponse.json({ message: "Unauthorized" }, { status: 401 });
  }

  const body = (await req.json().catch(() => null)) as {
    problemId?: string;
    language?: string;
    code?: string;
  } | null;

  const problemId = body?.problemId?.trim() ?? "";
  const language = body?.language?.trim() ?? "";
  const code = body?.code?.trim() ?? "";

  if (!problemId || !code) {
    return NextResponse.json(
      { message: `${!!problemId ? "code" : "problemId"} is required` },
      { status: 400 },
    );
  }

  if (!Object.values(Language).includes(language as Language)) {
    return NextResponse.json({ message: "Invalid language" }, { status: 400 });
  }

  const problem = await prisma.problem.findUnique({
    where: {
      id: problemId,
    },
    select: {
      isHidden: true,
    },
  });

  if (!problem || problem.isHidden) {
    return NextResponse.json({ message: "Problem not found" }, { status: 404 });
  }

  const submission = await prisma.$transaction(async (tx) => {
    const [sub] = await Promise.all([
      tx.submission.create({
        data: {
          userId: session.user.id,
          problemId,
          language: language as Language,
          code: code,
          status: "QUEUED",
        },
        select: {
          id: true,
          language: true,
          code: true,
          status: true,
          createdAt: true,
        },
      }),
      tx.userProblem.upsert({
        where: {
          userId_problemId: {
            userId: session.user.id,
            problemId,
          },
        },
        update: {},
        create: {
          userId: session.user.id,
          problemId,
          status: "ATTEMPTED",
        },
      }),
    ]);

    await redisService.xAdd("code-executions", {
      id: sub.id,
      submissionId: sub.id,
      problemId,
      language: sub.language,
      code: sub.code,
      status: sub.status,
      createdAt: sub.createdAt.toISOString(),
    });

    return sub;
  });

  return NextResponse.json({
    id: submission.id,
  });
}
