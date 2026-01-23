import { ProblemList } from "@/components/problem-list";
import { getCachedInitialProblemPage } from "@/lib/db/queries";
import { auth } from "@/lib/auth";
import { headers } from "next/headers";
import { prisma } from "@codearena/db";
import { SWRConfig } from "swr";
import { unstable_serialize } from "swr/infinite";
import { getProblemsKey } from "@/lib/problems-keys";

async function getProblems(tags?: string[]) {
  const [baseProblems, session] = await Promise.all([
    getCachedInitialProblemPage(tags),
    auth.api.getSession({ headers: await headers() }),
  ]);

  const userId = session?.user?.id;
  if (!userId) {
    return [baseProblems];
  }

  const userProblems = await prisma.userProblem.findMany({
    where: {
      userId,
      problemId: { in: baseProblems.map((p) => p.id) },
    },
    select: { problemId: true, status: true },
  });

  const userProblemsMap = new Map(
    userProblems.map((p) => [p.problemId, p.status]),
  );

  return [
    baseProblems.map((p) => ({
      ...p,
      status: userProblemsMap.get(p.id),
    })),
  ];
}

export default async function ProblemsPage({
  searchParams,
}: {
  searchParams: Promise<{ tags?: string[] }>;
}) {
  let { tags } = await searchParams;
  tags = tags ? (tags instanceof Array ? tags : [tags]) : undefined;
  const fallbackValue = {
    [unstable_serialize(getProblemsKey({ tags }))]: getProblems(tags),
  };

  return (
    <div className="pb-12 min-h-svh">
      <div className="mb-6">
        <p className="font-mono-label mb-1">PRACTICE</p>
        <h1 className="text-display text-3xl tracking-tighter">Problems</h1>
        <p className="mt-2 text-sm text-secondary max-w-md">
          Master algorithms, one problem at a time.
        </p>
      </div>

      <SWRConfig value={{ fallback: fallbackValue }}>
        <ProblemList initialTags={tags} />
      </SWRConfig>
    </div>
  );
}
