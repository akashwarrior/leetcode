import { notFound } from "next/navigation";
import { CURRENT_USER } from "@/lib/dummy-data";
import { ProfileOverview } from "@/components/profile-overview";

export default async function UserProfilePage({
  params,
}: {
  params: Promise<{ username: string }>;
}) {
  // if ((await params).username !== CURRENT_USER.userName) {
  //   notFound();
  // }

  return <ProfileOverview />;
}
