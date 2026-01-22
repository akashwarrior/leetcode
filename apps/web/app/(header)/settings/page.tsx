import { ProfileTab } from "@/components/profile-tab";
import { SecurityTab } from "@/components/security-tab";
import { AppearanceTab } from "@/components/appearance-tab";
import { User, Shield, PaintBrush } from "@phosphor-icons/react/dist/ssr";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { auth } from "@/lib/auth";
import { headers } from "next/headers";
import { redirect } from "next/navigation";

type Tab = "profile" | "security" | "appearance";

const TABS: { id: Tab; label: string; icon: React.ElementType }[] = [
  { id: "profile", label: "Profile", icon: User },
  { id: "security", label: "Security", icon: Shield },
  { id: "appearance", label: "Appearance", icon: PaintBrush },
] as const;

export default async function SettingsPage() {
  const session = await auth.api.getSession({
    headers: await headers(),
  });

  if (!session) {
    redirect("/sign-in");
  }

  return (
    <div className="max-w-3xl mx-auto pb-10">
      <div className="mb-8">
        <p className="font-mono-label mb-1">SETTINGS</p>
        <h1 className="text-display text-3xl tracking-tighter">Settings</h1>
        <p className="mt-2 text-sm text-secondary max-w-md">
          Manage your profile, preferences, and security settings.
        </p>
      </div>

      <Tabs defaultValue="profile" className="flex flex-col sm:flex-row! gap-6">
        <TabsList className="flex flex-row sm:flex-col! gap-1 sm:w-44 h-fit! rounded-lg">
          {TABS.map((t) => (
            <TabsTrigger
              value={t.id}
              key={t.id}
              className="flex items-center gap-2.5 text-sm justify-start w-full py-2 rounded-md"
            >
              <t.icon size={15} className="text-secondary" />
              {t.label}
            </TabsTrigger>
          ))}
        </TabsList>

        <div className="flex-1 nothing-card p-6">
          <TabsContent value="profile">
            <ProfileTab user={session.user} />
          </TabsContent>

          <TabsContent value="security">
            <SecurityTab />
          </TabsContent>

          <TabsContent value="appearance">
            <AppearanceTab />
          </TabsContent>
        </div>
      </Tabs>
    </div>
  );
}
