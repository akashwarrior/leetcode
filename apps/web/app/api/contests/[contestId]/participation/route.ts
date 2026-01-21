import { prisma } from "@codearena/db";
import { revalidateTag } from "next/cache";
import { NextResponse } from "next/server";
import { headers } from "next/headers";
import { auth } from "@/lib/auth";

async function getContestByParam(contestId: string) {
  return prisma.contest.findFirst({
    where: {
      isHidden: false,
      OR: [{ id: contestId }, { slug: contestId }],
    },
    select: {
      id: true,
      slug: true,
      title: true,
      startTime: true,
      endTime: true,
    },
  });
}

export async function POST(
  _request: Request,
  { params }: { params: Promise<{ contestId: string }> },
) {
  const session = await auth.api.getSession({ headers: await headers() });

  if (!session?.user?.id) {
    return NextResponse.json({ message: "Unauthorized" }, { status: 401 });
  }

  const { contestId } = await params;
  const contest = await getContestByParam(contestId);

  if (!contest) {
    return NextResponse.json({ message: "Contest not found" }, { status: 404 });
  }

  if (contest.endTime <= new Date()) {
    return NextResponse.json(
      { message: "This contest has already ended" },
      { status: 400 },
    );
  }

  await prisma.contestParticipation.upsert({
    where: {
      userId_contestId: {
        userId: session.user.id,
        contestId: contest.id,
      },
    },
    update: {},
    create: {
      userId: session.user.id,
      contestId: contest.id,
    },
  });

  revalidateTag("contests",{
    expire: undefined,
  });

  return NextResponse.json({ registered: true });
}

export async function DELETE(
  _request: Request,
  { params }: { params: Promise<{ contestId: string }> },
) {
  const session = await auth.api.getSession({ headers: await headers() });

  if (!session?.user?.id) {
    return NextResponse.json({ message: "Unauthorized" }, { status: 401 });
  }

  const { contestId } = await params;
  const contest = await getContestByParam(contestId);

  if (!contest) {
    return NextResponse.json({ message: "Contest not found" }, { status: 404 });
  }

  if (contest.startTime <= new Date()) {
    return NextResponse.json(
      {
        message: "Registration can only be cancelled before the contest starts",
      },
      { status: 400 },
    );
  }

  await prisma.contestParticipation.deleteMany({
    where: {
      userId: session.user.id,
      contestId: contest.id,
    },
  });

  revalidateTag("contests", {
    expire: undefined,
  });

  return NextResponse.json({ registered: false });
}
