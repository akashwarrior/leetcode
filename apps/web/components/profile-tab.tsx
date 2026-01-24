"use client";

import type { Session } from "@/lib/auth/client";
import { useState, useRef } from "react";
import { mutate } from "swr";
import Image from "next/image";
import { toast } from "sonner";
import { cn } from "@/lib/utils";
import { Input } from "@/components/ui/input";
import { updateUser } from "@/lib/auth/client";
import { Button } from "@/components/ui/button";
import {
  XIcon,
  SpinnerIcon,
  CheckIcon,
  CameraIcon,
} from "@phosphor-icons/react";

export function ProfileTab({ user }: { user: Session["user"] }) {
  const [name, setName] = useState<string>(user.name ?? "");
  const [username, setUsername] = useState<string>(user.username ?? "");
  const [githubUrl, setGithubUrl] = useState<string>(user.githubUrl ?? "");
  const [avatarUrl, setAvatarUrl] = useState<string | null>(user.image ?? null);

  const [saved, setSaved] = useState<boolean>(false);
  const [saving, setSaving] = useState<boolean>(false);

  const fileInputRef = useRef<HTMLInputElement>(null);

  async function handleSave(e: React.SubmitEvent) {
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
      image: avatarUrl,
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

  const handleAvatarChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const maxFileSize = 5 * 1024 * 1024;
    if (file.size > maxFileSize) {
      toast.error("Image must be smaller or equal to 5MB.");
      return;
    }

    try {
      const reader = new FileReader();
      reader.onloadend = async () => setAvatarUrl(reader.result as string);
      reader.onerror = () => toast.error("Failed to read image file.");
      reader.readAsDataURL(file);
    } catch {
      toast.error("Failed to process image.");
    }

    if (fileInputRef.current) {
      fileInputRef.current.value = "";
    }
  };

  return (
    <form className="flex flex-col gap-6" onSubmit={handleSave}>
      <div className="flex items-center gap-5 pb-6 border-b border-border">
        <div className="relative group shrink-0">
          <div className="flex size-18 items-center justify-center rounded-lg bg-muted text-2xl font-medium text-primary select-none overflow-hidden">
            {avatarUrl ? (
              <Image
                src={avatarUrl}
                alt="Avatar"
                width={72}
                height={72}
                className="size-full object-cover"
              />
            ) : (
              user.name.charAt(0)
            )}
          </div>
          <div className="absolute inset-0 flex items-center justify-center gap-1 rounded-lg bg-background/80 opacity-0 group-hover:opacity-100 transition-opacity">
            <button
              type="button"
              disabled={saving}
              className="flex size-7 items-center justify-center rounded-md bg-primary text-primary-foreground hover:bg-primary/90 disabled:opacity-50"
              onClick={() => fileInputRef.current?.click()}
            >
              {saving ? (
                <SpinnerIcon size={12} className="animate-spin" />
              ) : (
                <CameraIcon size={12} />
              )}
            </button>
            {avatarUrl && (
              <button
                type="button"
                disabled={saving}
                className="flex size-7 items-center justify-center rounded-md bg-error text-white hover:bg-error/90 disabled:opacity-50"
                onClick={() => setAvatarUrl(null)}
              >
                <XIcon size={12} />
              </button>
            )}
          </div>
        </div>
        <input
          ref={fileInputRef}
          type="file"
          accept="image/*"
          className="hidden"
          onChange={handleAvatarChange}
        />
        <div className="min-w-0">
          <p className="text-sm font-medium text-primary truncate">
            {user.name ?? user.email}
          </p>
          <p className="text-xs text-secondary mt-0.5 truncate">
            @{user.username}
          </p>
          <p className="mt-1 text-[11px] text-muted-foreground">
            (JPEG, PNG, WebP or GIF. Max 5MB.)
          </p>
        </div>
      </div>

      <div className="grid gap-4 sm:grid-cols-2">
        <div>
          <label className="font-mono-label mb-1.5 block">Full name</label>
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
          <label className="font-mono-label mb-1.5 block">Username</label>
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
              ? "bg-success/10 status-success border border-success/20"
              : "bg-primary text-primary-foreground hover:opacity-85",
          )}
        >
          {saving ? (
            <SpinnerIcon className="size-4 animate-spin" />
          ) : saved ? (
            <>
              <CheckIcon size={14} /> Saved
            </>
          ) : (
            "Save changes"
          )}
        </Button>
      </div>
    </form>
  );
}
