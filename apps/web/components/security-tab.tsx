"use client";

import { useState } from "react";
import { toast } from "sonner";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Spinner, Key, Globe } from "@phosphor-icons/react";
import {
  changePassword,
  deleteUser,
  revokeOtherSessions,
} from "@/lib/auth/client";

export function SecurityTab() {
  const [showPasswordForm, setShowPasswordForm] = useState(false);
  const [updatingPassword, setUpdatingPassword] = useState(false);

  const [currentPassword, setCurrentPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");

  const [loggingOutAll, setLoggingOutAll] = useState(false);
  const [deleting, setDeleting] = useState(false);

  async function handleUpdatePassword(e: React.FormEvent) {
    e.preventDefault();

    if (newPassword !== confirmPassword) {
      toast.error("New passwords do not match");
      return;
    }

    if (newPassword.length < 8) {
      toast.error("Password must be at least 8 characters");
      return;
    }

    setUpdatingPassword(true);
    const { error } = await changePassword({
      newPassword,
      currentPassword,
      revokeOtherSessions: true,
    });
    setUpdatingPassword(false);

    if (error) {
      toast.error(error.message || "Failed to update password");
      return;
    }

    toast.success("Password updated successfully");
    setShowPasswordForm(false);
    setCurrentPassword("");
    setNewPassword("");
    setConfirmPassword("");
  }

  async function handleSignOutAll() {
    const ok = window.confirm(
      "Are you sure you want to sign out of all other active sessions?",
    );
    if (!ok) return;

    setLoggingOutAll(true);
    const { error } = await revokeOtherSessions();
    setLoggingOutAll(false);

    if (error) {
      toast.error(error.message || "Failed to revoke sessions");
      return;
    }
    toast.success("All other sessions signed out");
  }

  async function handleDeleteAccount() {
    const confirmation = window.prompt(
      "Type 'DELETE' to permanently delete your CodeArena account and all associated data.",
    );

    if (confirmation !== "DELETE") {
      if (confirmation) toast.error("Account deletion cancelled");
      return;
    }

    setDeleting(true);
    const { error } = await deleteUser({
      callbackURL: "/",
    });

    if (error) {
      toast.error(error.message || "Failed to delete account");
      setDeleting(false);
      return;
    }

    toast.success("Account deleted");
  }

  return (
    <div className="space-y-1 divide-y divide-border">
      <div className="py-4 first:pt-0">
        <div className="flex items-start justify-between gap-4">
          <div className="min-w-0 flex-1">
            <p className="text-sm font-medium text-primary">Password</p>
            <p className="text-xs text-secondary mt-0.5">
              Secure your account by keeping your password updated
            </p>
          </div>
          <Button
            variant="outline"
            size="sm"
            className="h-8 rounded-lg text-xs font-medium shrink-0"
            onClick={() => {
              setShowPasswordForm(!showPasswordForm);
            }}
          >
            <Key size={12} className="mr-1.5" />
            {showPasswordForm ? "Close" : "Change"}
          </Button>
        </div>

        {showPasswordForm && (
          <form
            onSubmit={handleUpdatePassword}
            className="mt-4 space-y-3 p-4 rounded-lg bg-muted/30 border border-border"
          >
            <div>
              <label className="font-mono-label mb-1.5 block">
                Current password
              </label>
              <Input
                type="password"
                value={currentPassword}
                onChange={(e) => setCurrentPassword(e.target.value)}
                className="h-9 rounded-lg text-sm"
                placeholder="••••••••"
                required
                disabled={updatingPassword}
              />
            </div>
            <div>
              <label className="font-mono-label mb-1.5 block">
                New password
              </label>
              <Input
                type="password"
                value={newPassword}
                onChange={(e) => setNewPassword(e.target.value)}
                className="h-9 rounded-lg text-sm"
                placeholder="••••••••"
                required
                minLength={8}
                disabled={updatingPassword}
              />
            </div>
            <div>
              <label className="font-mono-label mb-1.5 block">
                Confirm new password
              </label>
              <Input
                type="password"
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                className="h-9 rounded-lg text-sm"
                placeholder="••••••••"
                required
                disabled={updatingPassword}
              />
            </div>
            <div className="flex justify-end gap-2 pt-1">
              <Button
                type="button"
                variant="outline"
                size="sm"
                className="h-8 rounded-lg text-xs"
                disabled={updatingPassword}
                onClick={() => setShowPasswordForm(false)}
              >
                Cancel
              </Button>
              <Button
                type="submit"
                size="sm"
                disabled={updatingPassword}
                className="h-8 rounded-lg text-xs bg-primary text-primary-foreground hover:opacity-85 min-w-28"
              >
                {updatingPassword ? (
                  <Spinner className="animate-spin size-4" />
                ) : (
                  "Update password"
                )}
              </Button>
            </div>
          </form>
        )}
      </div>

      <div className="py-4">
        <div className="flex items-start justify-between gap-4">
          <div className="min-w-0 flex-1">
            <p className="text-sm font-medium text-primary">Active sessions</p>
            <p className="text-xs text-secondary mt-0.5">
              Sign out all other active devices except this one
            </p>
          </div>
          <Button
            variant="outline"
            size="sm"
            disabled={loggingOutAll}
            className="h-8 rounded-lg text-xs font-medium shrink-0 status-error border-error/20 hover:bg-error/10 min-w-24"
            onClick={handleSignOutAll}
          >
            {loggingOutAll ? (
              <Spinner className="animate-spin size-4" />
            ) : (
              <>
                <Globe size={12} className="mr-1.5" />
                Sign out all
              </>
            )}
          </Button>
        </div>
      </div>

      <div className="py-4">
        <div className="flex items-start justify-between gap-4">
          <div className="min-w-0 flex-1">
            <p className="text-sm font-medium status-error">Delete account</p>
            <p className="text-xs text-secondary mt-0.5">
              Permanently delete your account, submissions, and all data
            </p>
          </div>
          <Button
            variant="outline"
            size="sm"
            disabled={deleting}
            className="h-8 rounded-lg text-xs font-medium shrink-0 status-error border-error/20 hover:bg-error/10 min-w-20"
            onClick={handleDeleteAccount}
          >
            {deleting ? <Spinner className="animate-spin size-4" /> : "Delete"}
          </Button>
        </div>
      </div>
    </div>
  );
}
