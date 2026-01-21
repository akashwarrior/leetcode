import { ProfileOverview } from "@/components/profile-overview";
import { getCachedUserProfile } from "@/lib/db/queries";
import { notFound } from "next/navigation";

export default async function UserProfilePage({
  params,
}: {
  params: Promise<{ username: string }>;
}) {
  const { username } = await params;

  const user = await getCachedUserProfile(username);

  if (!user) {
    notFound();
  }

  return <ProfileOverview user={user} />;
}
