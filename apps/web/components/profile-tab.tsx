"use client";

import type { Session } from "@/lib/auth-client";
import { useState, useEffect } from "react";
import { mutate } from "swr";
import Image from "next/image";
import { toast } from "sonner";
import { cn } from "@/lib/utils";
import { Input } from "@/components/ui/input";
import { updateUser } from "@/lib/auth-client";
import { Button } from "@/components/ui/button";
import { LoaderCircle, Check, Camera } from "lucide-react";

export function ProfileTab({ user }: { user: Session["user"] }) {
  const [name, setName] = useState<string>("");
  const [username, setUsername] = useState<string>("");
  const [githubUrl, setGithubUrl] = useState<string>("");
  const [saved, setSaved] = useState<boolean>(false);
  const [saving, setSaving] = useState<boolean>(false);

  useEffect(() => {
    if (user) {
      setName(user.name ?? "");
      setUsername(user.username ?? "");
      setGithubUrl(user.githubUrl ?? "");
    }
  }, [user]);

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
    setSaving(false);

    if (error) {
      toast.error(error.message || "Failed to update profile");
      return;
    }

    await mutate("session");
    setSaved(true);
    toast.success("Profile updated successfully");
    setTimeout(() => setSaved(false), 2000);
  }

  if (!user) {
    return (
      <div className="flex justify-center p-10">
        <LoaderCircle className="animate-spin text-muted-foreground size-6" />
      </div>
    );
  }

  return (
    <form className="space-y-6" onSubmit={handleSave}>
      <div className="flex items-center gap-5 pb-6 border-b border-border">
        <div className="relative group shrink-0">
          <div className="flex size-[72px] items-center justify-center rounded-xl bg-linear-to-br from-primary/20 to-purple-500/20 text-2xl font-bold text-primary select-none overflow-hidden object-cover">
            {user.image ? (
              <Image
                src={user.image}
                alt="Avatar"
                width={72}
                height={72}
                className="size-full object-cover"
              />
            ) : (
              user.name[0]?.toUpperCase()
            )}
          </div>
          <button
            type="button"
            className="absolute inset-0 flex items-center justify-center rounded-xl bg-background/80 opacity-0 group-hover:opacity-100 transition-opacity"
            onClick={() => {
              toast.info(
                "Avatar uploads are disabled in this environment. Please link a provider like Google to change your avatar.",
              );
            }}
          >
            <Camera size={16} className="text-muted-foreground" />
          </button>
        </div>
        <div className="min-w-0">
          <p className="text-sm font-medium truncate">{user.name}</p>
          <p className="text-xs text-muted-foreground mt-0.5 mb-3 truncate">
            @{user.username}
          </p>
        </div>
      </div>

      <div className="grid gap-4 sm:grid-cols-2">
        <div>
          <label className="text-xs font-medium text-muted-foreground mb-1.5 block">
            Full name
          </label>
          <Input
            value={name}
            onChange={(e) => setName(e.target.value)}
            className="h-9 rounded-lg text-sm"
            placeholder="Your name"
            required
            disabled={saving}
          />
        </div>
        <div>
          <label className="text-xs font-medium text-muted-foreground mb-1.5 block">
            Username
          </label>
          <Input
            value={username}
            onChange={(e) => setUsername(e.target.value)}
            className="h-9 rounded-lg text-sm"
            placeholder="username"
            required
            disabled={saving}
          />
        </div>
        <div className="sm:col-span-2">
          <label className="text-xs font-medium text-muted-foreground mb-1.5 block">
            Email address
          </label>
          <Input
            value={user.email}
            type="email"
            disabled
            className="h-9 rounded-lg text-sm opacity-50 cursor-not-allowed bg-muted"
            title="Email addresses cannot be changed directly."
          />
        </div>
        <div className="sm:col-span-2">
          <label className="text-xs font-medium text-muted-foreground mb-1.5 block">
            GitHub URL
          </label>
          <Input
            value={githubUrl}
            onChange={(e) => setGithubUrl(e.target.value)}
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
              ? "bg-emerald-500/10 text-emerald-500 border border-emerald-500/20"
              : "gradient-primary border-0 text-white",
          )}
        >
          {saving ? (
            <LoaderCircle className="size-4 animate-spin" />
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
