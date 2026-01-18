import { ProfileOverview } from "@/components/profile-overview";
import { prisma } from "@codearena/db";
import { notFound } from "next/navigation";

export default async function UserProfilePage({
  params,
}: {
  params: Promise<{ username: string }>;
}) {
  const { username } = await params;

  const user = await prisma.user.findFirst({
    where: {
      username: username,
    },
    include: {
      _count: {
        select: {
          participations: true,
        },
      },
    },
  });

  if (!user) {
    notFound();
  }

  return <ProfileOverview user={user} />;
}
