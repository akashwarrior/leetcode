import { ProfileTab } from "@/components/profile-tab";
import { SecurityTab } from "@/components/security-tab";
import { AppearanceTab } from "@/components/appearance-tab";
import { User, Shield, Palette } from "lucide-react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { auth } from "@/lib/auth";
import { headers } from "next/headers";
import { redirect } from "next/navigation";

type Tab = "profile" | "security" | "appearance";

const TABS: { id: Tab; label: string; icon: React.ElementType }[] = [
  { id: "profile", label: "Profile", icon: User },
  { id: "security", label: "Security", icon: Shield },
  { id: "appearance", label: "Appearance", icon: Palette },
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
        <h1 className="text-xl font-medium tracking-tight">Settings</h1>
        <p className="mt-0.5 text-sm text-muted-foreground">
          Manage your profile, preferences, update your password, and control
          your account.
        </p>
      </div>

      <Tabs defaultValue="profile" className="flex flex-col sm:flex-row! gap-6">
        <TabsList className="flex flex-row sm:flex-col! gap-1 sm:w-44 h-fit!">
          {TABS.map((t) => (
            <TabsTrigger
              value={t.id}
              key={t.id}
              className="flex items-center gap-2.5 text-sm justify-start w-full py-2"
            >
              <t.icon size={15} className="text-muted-foreground" />
              {t.label}
            </TabsTrigger>
          ))}
        </TabsList>

        <div className="flex-1 surface-card rounded-xl p-6 border border-border">
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
