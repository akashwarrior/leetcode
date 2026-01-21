"use client";

import type { Session } from "@/lib/auth/client";
import { useState } from "react";
import { mutate } from "swr";
import Image from "next/image";
import { toast } from "sonner";
import { cn } from "@/lib/utils";
import { Input } from "@/components/ui/input";
import { updateUser } from "@/lib/auth/client";
import { Button } from "@/components/ui/button";
import { Spinner, Check, Camera } from "@phosphor-icons/react";

export function ProfileTab({ user }: { user: Session["user"] }) {
  const [name, setName] = useState<string>(user.name ?? "");
  const [username, setUsername] = useState<string>(user.username ?? "");
  const [githubUrl, setGithubUrl] = useState<string>(user.githubUrl ?? "");
  const [saved, setSaved] = useState<boolean>(false);
  const [saving, setSaving] = useState<boolean>(false);

  async function handleSave(e: React.FormEvent) {
    e.preventDefault();
    if (!name.trim() || !username.trim()) {
      toast.error("Name and username cannot be empty.");
      return;
    }

    setSaving(true);
    const { error } = await updateUser({
      name,
      username,
      githubUrl,
    });

    if (error) {
      setSaving(false);
      toast.error(error.message || "Failed to update profile");
      return;
    }

    await mutate("session");
    setSaved(true);
    setSaving(false);
    toast.success("Profile updated successfully");
    setTimeout(() => setSaved(false), 2000);
  }

  const handleFieldChange = () => {
    if (saved) {
      setSaved(false);
    }
  };

  return (
    <form className="space-y-6" onSubmit={handleSave}>
      <div className="flex items-center gap-5 pb-6 border-b border-border">
        <div className="relative group shrink-0">
          <div className="flex size-[72px] items-center justify-center rounded-lg bg-muted text-2xl font-medium text-primary select-none overflow-hidden object-cover">
            {user.image ? (
              <Image
                src={user.image}
                alt="Avatar"
                width={72}
                height={72}
                className="size-full object-cover capitalize"
              />
            ) : (
              user.name.charAt(0)
            )}
          </div>
          <button
            type="button"
            className="absolute inset-0 flex items-center justify-center rounded-lg bg-background/80 opacity-0 group-hover:opacity-100 transition-opacity"
            onClick={() => {
              toast.info(
                "Avatar uploads are disabled in this environment. Please link a provider like Google to change your avatar.",
              );
            }}
          >
            <Camera size={16} className="text-secondary" />
          </button>
        </div>
        <div className="min-w-0">
          <p className="text-sm font-medium text-primary truncate">
            {user.name ?? user.email}
          </p>
          <p className="text-xs text-secondary mt-0.5 mb-3 truncate">
            @{user.username}
          </p>
        </div>
      </div>

      <div className="grid gap-4 sm:grid-cols-2">
        <div>
          <label className="font-mono-label mb-1.5 block">Full name</label>
          <Input
            value={name}
            onChange={(e) => {
              setName(e.target.value);
              handleFieldChange();
            }}
            className="h-9 rounded-lg text-sm"
            placeholder="Your name"
            required
            disabled={saving}
          />
        </div>
        <div>
          <label className="font-mono-label mb-1.5 block">Username</label>
          <Input
            value={username}
            onChange={(e) => {
              setUsername(e.target.value);
              handleFieldChange();
            }}
            className="h-9 rounded-lg text-sm"
            placeholder="username"
            required
            disabled={saving}
          />
        </div>
        <div className="sm:col-span-2">
          <label className="font-mono-label mb-1.5 block">Email address</label>
          <Input
            value={user.email}
            type="email"
            disabled
            className="h-9 rounded-lg text-sm opacity-50 cursor-not-allowed bg-muted"
            title="Email addresses cannot be changed directly."
          />
        </div>
        <div className="sm:col-span-2">
          <label className="font-mono-label mb-1.5 block">GitHub URL</label>
          <Input
            value={githubUrl}
            onChange={(e) => {
              setGithubUrl(e.target.value);
              handleFieldChange();
            }}
            placeholder="https://github.com/your-profile"
            className="h-9 rounded-lg text-sm"
            disabled={saving}
          />
        </div>
      </div>

      <div className="flex justify-end pt-2">
        <Button
          type="submit"
          disabled={saving}
          className={cn(
            "h-9 rounded-lg text-sm font-medium px-5 gap-2",
            saved
              ? "bg-success/10 status-success border border-success/20"
              : "bg-primary text-primary-foreground hover:opacity-85",
          )}
        >
          {saving ? (
            <Spinner className="size-4 animate-spin" />
          ) : saved ? (
            <>
              <Check size={14} /> Saved
            </>
          ) : (
            "Save changes"
          )}
        </Button>
      </div>
    </form>
  );
}
