"use client";

import { useState } from "react";
import {
  User,
  Key,
  Bell,
  Eye,
  Shield,
  Palette,
  Camera,
  Check,
  Globe,
  Moon,
  Sun,
  Monitor,
} from "lucide-react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Switch } from "@/components/ui/switch";
import { CURRENT_USER } from "@/lib/dummy-data";
import { cn } from "@/lib/utils";
import { toast } from "sonner";
import { useTheme } from "next-themes";

type Tab = "profile" | "security" | "notifications" | "appearance";

const TABS: { id: Tab; label: string; icon: React.ElementType }[] = [
  { id: "profile", label: "Profile", icon: User },
  { id: "security", label: "Security", icon: Shield },
  { id: "notifications", label: "Notifications", icon: Bell },
  { id: "appearance", label: "Appearance", icon: Palette },
];

function ProfileTab() {
  const [saving, setSaving] = useState(false);
  const [saved, setSaved] = useState(false);

  function handleSave() {
    setSaving(true);
    setTimeout(() => {
      setSaving(false);
      setSaved(true);
      toast.success("Profile updated successfully");
      setTimeout(() => setSaved(false), 2000);
    }, 800);
  }

  return (
    <div className="space-y-6">
      {/* Avatar */}
      <div className="flex items-center gap-5 pb-6 border-b border-border">
        <div className="relative group shrink-0">
          <div className="flex size-[72px] items-center justify-center rounded-xl bg-gradient-to-br from-primary/20 to-purple-500/20 text-2xl font-bold text-primary select-none">
            {CURRENT_USER.name[0]}
          </div>
          <button className="absolute inset-0 flex items-center justify-center rounded-xl bg-background/80 opacity-0 group-hover:opacity-100 transition-opacity">
            <Camera size={16} className="text-muted-foreground" />
          </button>
        </div>
        <div>
          <p className="text-sm font-medium">{CURRENT_USER.name}</p>
          <p className="text-xs text-muted-foreground mt-0.5 mb-3">@{CURRENT_USER.userName}</p>
          <Button
            variant="outline"
            size="sm"
            className="h-7 rounded-md text-xs font-medium"
          >
            Change photo
          </Button>
        </div>
      </div>

      {/* Fields */}
      <div className="grid gap-4 sm:grid-cols-2">
        <div>
          <label className="text-xs font-medium text-muted-foreground mb-1.5 block">
            Full name
          </label>
          <Input
            defaultValue={CURRENT_USER.name}
            className="h-9 rounded-lg text-sm"
          />
        </div>
        <div>
          <label className="text-xs font-medium text-muted-foreground mb-1.5 block">
            Username
          </label>
          <Input
            defaultValue={CURRENT_USER.userName}
            className="h-9 rounded-lg text-sm"
          />
        </div>
        <div className="sm:col-span-2">
          <label className="text-xs font-medium text-muted-foreground mb-1.5 block">
            Email
          </label>
          <Input
            defaultValue="akash@example.com"
            type="email"
            className="h-9 rounded-lg text-sm"
          />
        </div>
        <div className="sm:col-span-2">
          <label className="text-xs font-medium text-muted-foreground mb-1.5 block">
            Bio
          </label>
          <Input
            defaultValue="Competitive programmer & full-stack developer"
            className="h-9 rounded-lg text-sm"
          />
        </div>
        <div>
          <label className="text-xs font-medium text-muted-foreground mb-1.5 block">
            Location
          </label>
          <Input
            defaultValue="India"
            className="h-9 rounded-lg text-sm"
          />
        </div>
        <div>
          <label className="text-xs font-medium text-muted-foreground mb-1.5 block">
            Website
          </label>
          <Input
            defaultValue="akashgupta.tech"
            className="h-9 rounded-lg text-sm"
          />
        </div>
      </div>

      <div className="flex justify-end pt-2">
        <Button
          onClick={handleSave}
          disabled={saving}
          className={cn(
            "h-9 rounded-lg text-sm font-medium px-5 gap-2",
            saved
              ? "bg-emerald-500/10 text-emerald-500 border border-emerald-500/20"
              : "gradient-primary border-0 text-white"
          )}
        >
          {saving ? (
            "Saving..."
          ) : saved ? (
            <>
              <Check size={14} /> Saved
            </>
          ) : (
            "Save changes"
          )}
        </Button>
      </div>
    </div>
  );
}

function SecurityTab() {
  const [showPasswordForm, setShowPasswordForm] = useState(false);
  const [twoFA, setTwoFA] = useState(false);

  return (
    <div className="space-y-1 divide-y divide-border">
      {/* Change password */}
      <div className="py-4 first:pt-0">
        <div className="flex items-start justify-between gap-4">
          <div className="min-w-0 flex-1">
            <p className="text-sm font-medium">Password</p>
            <p className="text-xs text-muted-foreground mt-0.5">
              Last changed 30 days ago
            </p>
          </div>
          <Button
            variant="outline"
            size="sm"
            className="h-8 rounded-md text-xs font-medium shrink-0"
            onClick={() => {
              setShowPasswordForm(!showPasswordForm);
            }}
          >
            <Key size={12} className="mr-1.5" />
            Change
          </Button>
        </div>
        {showPasswordForm && (
          <div className="mt-4 space-y-3 p-4 rounded-lg bg-muted/30 border border-border">
            <div>
              <label className="text-xs font-medium text-muted-foreground mb-1.5 block">
                Current password
              </label>
              <Input type="password" className="h-9 rounded-lg text-sm" placeholder="••••••••" />
            </div>
            <div>
              <label className="text-xs font-medium text-muted-foreground mb-1.5 block">
                New password
              </label>
              <Input type="password" className="h-9 rounded-lg text-sm" placeholder="••••••••" />
            </div>
            <div>
              <label className="text-xs font-medium text-muted-foreground mb-1.5 block">
                Confirm new password
              </label>
              <Input type="password" className="h-9 rounded-lg text-sm" placeholder="••••••••" />
            </div>
            <div className="flex justify-end gap-2 pt-1">
              <Button
                variant="outline"
                size="sm"
                className="h-8 rounded-md text-xs"
                onClick={() => setShowPasswordForm(false)}
              >
                Cancel
              </Button>
              <Button
                size="sm"
                className="h-8 rounded-md text-xs gradient-primary border-0 text-white"
                onClick={() => {
                  toast.success("Password updated");
                  setShowPasswordForm(false);
                }}
              >
                Update password
              </Button>
            </div>
          </div>
        )}
      </div>

      {/* 2FA */}
      <div className="py-4">
        <div className="flex items-start justify-between gap-4">
          <div className="min-w-0 flex-1">
            <p className="text-sm font-medium">Two-factor authentication</p>
            <p className="text-xs text-muted-foreground mt-0.5">
              Add an extra layer of security to your account
            </p>
          </div>
          <Switch
            checked={twoFA}
            onCheckedChange={(v) => {
              setTwoFA(v);
              toast.success(v ? "Two-factor authentication enabled" : "Two-factor authentication disabled");
            }}
          />
        </div>
      </div>

      {/* Sessions */}
      <div className="py-4">
        <div className="flex items-start justify-between gap-4">
          <div className="min-w-0 flex-1">
            <p className="text-sm font-medium">Active sessions</p>
            <p className="text-xs text-muted-foreground mt-0.5">
              Sign out all other devices except this one
            </p>
          </div>
          <Button
            variant="outline"
            size="sm"
            className="h-8 rounded-md text-xs font-medium shrink-0 text-destructive border-destructive/20 hover:bg-destructive/10"
            onClick={() => toast.success("All other sessions ended")}
          >
            <Globe size={12} className="mr-1.5" />
            Sign out all
          </Button>
        </div>
      </div>

      {/* Danger zone */}
      <div className="py-4">
        <div className="flex items-start justify-between gap-4">
          <div className="min-w-0 flex-1">
            <p className="text-sm font-medium text-destructive">Delete account</p>
            <p className="text-xs text-muted-foreground mt-0.5">
              Permanently delete your account and all data
            </p>
          </div>
          <Button
            variant="outline"
            size="sm"
            className="h-8 rounded-md text-xs font-medium shrink-0 text-destructive border-destructive/20 hover:bg-destructive/10"
          >
            Delete
          </Button>
        </div>
      </div>
    </div>
  );
}

function NotificationsTab() {
  const [settings, setSettings] = useState({
    contestReminders: true,
    dailyChallenge: true,
    weeklyDigest: false,
    submissionResults: true,
    newFeatures: false,
    communityMentions: true,
  });

  function toggle(key: keyof typeof settings) {
    setSettings((prev) => {
      const next = { ...prev, [key]: !prev[key] };
      toast.success(`${next[key] ? "Enabled" : "Disabled"} ${key.replace(/([A-Z])/g, " $1").toLowerCase()}`);
      return next;
    });
  }

  const items = [
    { key: "contestReminders" as const, label: "Contest reminders", desc: "Get notified 15 minutes before a contest starts" },
    { key: "dailyChallenge" as const, label: "Daily challenge", desc: "Reminder to complete today's challenge" },
    { key: "weeklyDigest" as const, label: "Weekly digest", desc: "Summary of your progress and top problems" },
    { key: "submissionResults" as const, label: "Submission results", desc: "Email notifications for accepted/rejected submissions" },
    { key: "newFeatures" as const, label: "Product updates", desc: "New features and announcements from CodeArena" },
    { key: "communityMentions" as const, label: "Community mentions", desc: "When someone replies to your solutions" },
  ];

  return (
    <div className="divide-y divide-border space-y-1">
      {items.map((item) => (
        <div key={item.key} className="flex items-start justify-between gap-4 py-4 first:pt-0">
          <div className="min-w-0 flex-1">
            <p className="text-sm font-medium">{item.label}</p>
            <p className="text-xs text-muted-foreground mt-0.5">{item.desc}</p>
          </div>
          <Switch
            checked={settings[item.key]}
            onCheckedChange={() => toggle(item.key)}
          />
        </div>
      ))}
    </div>
  );
}

function AppearanceTab() {
  const { theme, setTheme } = useTheme();
  const [editorTheme, setEditorTheme] = useState("dark");
  const [fontSize, setFontSize] = useState("14");

  const themes = [
    { id: "light", label: "Light", icon: Sun },
    { id: "dark", label: "Dark", icon: Moon },
    { id: "system", label: "System", icon: Monitor },
  ];

  return (
    <div className="space-y-6">
      {/* Theme */}
      <div>
        <p className="text-sm font-medium mb-1">Theme</p>
        <p className="text-xs text-muted-foreground mb-3">Choose how CodeArena looks</p>
        <div className="flex gap-2">
          {themes.map((t) => (
            <button
              key={t.id}
              onClick={() => {
                setTheme(t.id);
                toast.success(`${t.label} theme applied`);
              }}
              className={cn(
                "flex flex-col items-center gap-2 p-3 rounded-lg border transition-colors flex-1",
                theme === t.id
                  ? "border-primary bg-primary/5 text-primary"
                  : "border-border hover:border-foreground/20 text-muted-foreground hover:text-foreground"
              )}
            >
              <t.icon size={16} />
              <span className="text-xs font-medium">{t.label}</span>
            </button>
          ))}
        </div>
      </div>

      <div className="border-t border-border pt-6">
        <p className="text-sm font-medium mb-1">Editor</p>
        <p className="text-xs text-muted-foreground mb-4">Code editor preferences</p>

        <div className="space-y-4">
          <div className="flex items-center justify-between gap-4">
            <div>
              <p className="text-sm">Font size</p>
              <p className="text-xs text-muted-foreground mt-0.5">Editor code font size</p>
            </div>
            <div className="flex items-center gap-2">
              <button
                onClick={() => setFontSize((s) => String(Math.max(10, Number(s) - 1)))}
                className="flex size-7 items-center justify-center rounded-md border border-border hover:bg-muted text-sm transition-colors"
              >
                −
              </button>
              <span className="text-sm font-mono tabular-nums w-8 text-center">{fontSize}</span>
              <button
                onClick={() => setFontSize((s) => String(Math.min(24, Number(s) + 1)))}
                className="flex size-7 items-center justify-center rounded-md border border-border hover:bg-muted text-sm transition-colors"
              >
                +
              </button>
            </div>
          </div>

          <div className="flex items-center justify-between gap-4">
            <div>
              <p className="text-sm">Editor theme</p>
              <p className="text-xs text-muted-foreground mt-0.5">Code editor color scheme</p>
            </div>
            <select
              value={editorTheme}
              onChange={(e) => setEditorTheme(e.target.value)}
              className="h-8 rounded-md border border-border bg-card px-2.5 text-xs font-medium outline-none cursor-pointer text-foreground"
            >
              <option value="dark">Dark (Default)</option>
              <option value="monokai">Monokai</option>
              <option value="solarized">Solarized</option>
              <option value="github">GitHub</option>
            </select>
          </div>
        </div>
      </div>
    </div>
  );
}

export default function SettingsPage() {
  const [tab, setTab] = useState<Tab>("profile");
  const activeTab = TABS.find((t) => t.id === tab)!;

  return (
    <div className="max-w-3xl mx-auto pb-10">
      <div className="mb-8">
        <h1 className="text-xl font-medium tracking-tight">Settings</h1>
        <p className="mt-0.5 text-sm text-muted-foreground">
          Manage your profile, preferences, and account.
        </p>
      </div>

      <div className="flex flex-col sm:flex-row gap-6">
        {/* Sidebar */}
        <nav className="flex sm:flex-col gap-0.5 sm:w-44 shrink-0 sm:self-start">
          {TABS.map((t) => (
            <button
              key={t.id}
              onClick={() => setTab(t.id)}
              className={cn(
                "flex items-center gap-2.5 rounded-md px-3 py-2 text-sm transition-colors w-full text-left",
                tab === t.id
                  ? "bg-muted text-foreground font-medium"
                  : "text-muted-foreground hover:text-foreground hover:bg-muted/50"
              )}
            >
              <t.icon size={15} className={tab === t.id ? "text-primary" : "text-muted-foreground/60"} />
              {t.label}
            </button>
          ))}
        </nav>

        {/* Content */}
        <div className="flex-1 min-w-0">
          <div className="surface-card rounded-xl p-6">
            <div className="mb-5 pb-4 border-b border-border">
              <div className="flex items-center gap-2.5">
                <activeTab.icon size={15} className="text-muted-foreground" />
                <h2 className="text-sm font-medium">{activeTab.label}</h2>
              </div>
            </div>

            {tab === "profile" && <ProfileTab />}
            {tab === "security" && <SecurityTab />}
            {tab === "notifications" && <NotificationsTab />}
            {tab === "appearance" && <AppearanceTab />}
          </div>
        </div>
      </div>
    </div>
  );
}
