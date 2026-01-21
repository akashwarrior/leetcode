import { auth } from "@/lib/auth";
import { headers } from "next/headers";
import { ContestClient } from "@/components/contest-client";
import { getCachedContestList, getCachedTopUsers } from "@/lib/db/queries";
import { prisma } from "@codearena/db";
import { formatContestDateTime } from "@/lib/contest";

export default async function ContestPage() {
  const session = await auth.api.getSession({ headers: await headers() });
  const userId = session?.user?.id;

  const [contests, topUsers] = await Promise.all([
    getCachedContestList().then((contests) =>
      contests.map((c) => ({
        id: c.id,
        slug: c.slug,
        title: c.title,
        startTime: c.startTime,
        endTime: c.endTime,
        startLabel: formatContestDateTime(c.startTime),
        problemCount: c._count.problems,
        participantCount: c._count.participations,
      })),
    ),
    getCachedTopUsers(),
  ]);

  const [registeredContestIds, myStats] = !userId
    ? [[], null]
    : await Promise.all([
        prisma.contestParticipation
          .findMany({
            where: { userId, contestId: { in: contests.map((c) => c.id) } },
            select: { contestId: true },
          })
          .then((rows) => rows.map((r) => r.contestId)),
        prisma.user
          .findUnique({
            where: { id: userId },
            select: {
              username: true,
              globalRank: true,
              rating: true,
              streak: true,
              solvedEasy: true,
              solvedMedium: true,
              solvedHard: true,
              _count: { select: { participations: true } },
            },
          })
          .then((user) =>
            user
              ? {
                  username: user.username,
                  globalRank: user.globalRank,
                  rating: user.rating,
                  streak: user.streak,
                  solvedTotal:
                    user.solvedEasy + user.solvedMedium + user.solvedHard,
                  attended: user._count.participations,
                }
              : null,
          ),
      ]);

  return (
    <ContestClient
      contests={contests}
      topUsers={topUsers}
      myStats={myStats}
      registeredContestIds={registeredContestIds}
    />
  );
}
