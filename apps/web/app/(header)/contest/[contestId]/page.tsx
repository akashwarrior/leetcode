import { prisma } from "@codearena/db";
import { headers } from "next/headers";
import { notFound } from "next/navigation";
import { auth } from "@/lib/auth";
import {
  getCachedContestDetail,
  getCachedContestLeaderboard,
} from "@/lib/db/queries";
import { ContestDetailClient } from "@/components/contest-detail-client";

export default async function ContestDetailPage({
  params,
}: {
  params: Promise<{ contestId: string }>;
}) {
  const now = new Date();
  const { contestId } = await params;
  const session = await auth.api.getSession({ headers: await headers() });

  const contest = await getCachedContestDetail(contestId);

  if (!contest) {
    notFound();
  }

  const isUpcoming = new Date(contest.startTime) > now;

  const [leaderboard, participation] = await Promise.all([
    isUpcoming ? [] : getCachedContestLeaderboard(contest.id),
    session?.user?.id
      ? prisma.contestParticipation.findUnique({
          where: {
            userId_contestId: {
              userId: session.user.id,
              contestId: contest.id,
            },
          },
          select: { id: true },
        })
      : null,
  ]);

  return (
    <ContestDetailClient
      contest={{
        id: contest.id,
        slug: contest.slug,
        title: contest.title,
        description: contest.description,
        startTime: contest.startTime,
        endTime: contest.endTime,
        startLabel: new Date(contest.startTime).toLocaleString("en-US", {
          month: "short",
          day: "numeric",
          year: "numeric",
          hour: "numeric",
          minute: "2-digit",
        }),
        problemCount: contest._count.problems,
        participantCount: contest._count.participations,
        problems: contest.problems.map((item) => ({
          id: item.problem.id,
          slug: item.problem.slug,
          title: item.problem.title,
          difficulty: item.problem.difficulty,
          order: item.order,
          points: item.points,
        })),
        leaderboard: leaderboard.map((entry, index) => ({
          rank: entry.rank ?? index + 1,
          username: entry.user.username,
          score: entry.score,
          penalty: entry.penalty,
        })),
      }}
      isAuthed={Boolean(session?.user?.id)}
      isRegistered={Boolean(participation)}
      initialNow={now.toISOString()}
    />
  );
}
