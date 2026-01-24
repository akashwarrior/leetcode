import { NextResponse } from "next/server";
import { auth } from "@/lib/auth";
import { prisma } from "@codearena/db";
import { revalidateTag } from "next/cache";

async function getContestByParam(slug: string) {
  return prisma.contest.findFirst({
    where: {
      isHidden: false,
      slug,
    },
    select: {
      id: true,
      slug: true,
      startTime: true,
      endTime: true,
    },
  });
}

export async function POST(
  req: Request,
  { params }: { params: Promise<{ slug: string }> },
) {
  const session = await auth.api.getSession({ headers: req.headers });

  if (!session?.user) {
    return NextResponse.json({ message: "Unauthorized" }, { status: 401 });
  }

  const { slug } = await params;
  const contest = await getContestByParam(slug);

  if (!contest) {
    return NextResponse.json({ message: "Contest not found" }, { status: 404 });
  }

  const now = new Date();

  if (contest.startTime <= now || contest.endTime <= now) {
    return NextResponse.json(
      {
        message: `This contest has already ${contest.endTime <= now ? "ended" : "started"}`,
      },
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

  revalidateTag("contests", { expire: undefined });

  return NextResponse.json({ registered: true });
}

export async function DELETE(
  req: Request,
  { params }: { params: Promise<{ slug: string }> },
) {
  const session = await auth.api.getSession({ headers: req.headers });

  if (!session?.user) {
    return NextResponse.json({ message: "Unauthorized" }, { status: 401 });
  }

  const { slug } = await params;
  const contest = await getContestByParam(slug);

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

  revalidateTag("contests", { expire: undefined });

  return NextResponse.json({ registered: false });
}
