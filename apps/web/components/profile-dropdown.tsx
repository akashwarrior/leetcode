"use client";

import Link from "next/link";
import { mutate } from "swr";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { User, Settings, LogOut } from "lucide-react";
import { signOut, useSession } from "@/lib/auth-client";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

export function ProfileDropdown() {
  const { data } = useSession();
  const router = useRouter();

  const user = data?.user;

  if (!user) {
    return (
      <Button
        size="sm"
        nativeButton={false}
        render={
          <Link
            href="/sign-in"
            prefetch={false}
            className="text-white text-xs px-4 gradient-primary"
          >
            Sign In
          </Link>
        }
      />
    );
  }

  return (
    <DropdownMenu>
      <DropdownMenuTrigger
        render={
          <Button
            size="icon-sm"
            variant="ghost"
            className="items-center justify-center bg-linear-to-br from-primary/20 to-transparent text-[10px] font-bold text-primary"
          >
            {user.name.charAt(0)}
          </Button>
        }
      />

      <DropdownMenuContent align="end" className="w-48 rounded-lg">
        <div className="px-2 py-2 mb-1">
          <p className="text-sm font-medium truncate">{user.name}</p>
          <p className="text-xs text-muted-foreground truncate">
            @{user.username}
          </p>
        </div>
        <DropdownMenuSeparator />
        <DropdownMenuItem
          className="gap-2.5 rounded-md"
          nativeButton={false}
          render={
            <Link href={`/u/${user.username}`}>
              <User size={14} className="text-muted-foreground/40" />
              Profile
            </Link>
          }
        />

        <DropdownMenuItem
          className="gap-2.5 rounded-md"
          nativeButton={false}
          render={
            <Link href="/settings">
              <Settings size={14} className="text-muted-foreground/40" />
              Settings
            </Link>
          }
        />
        <DropdownMenuSeparator />
        <DropdownMenuItem
          className="gap-2.5 text-destructive focus:text-destructive rounded-md"
          onClick={async () => {
            await signOut();
            await mutate("session");
            router.refresh();
          }}
        >
          <LogOut size={14} className="text-destructive/40" />
          Sign out
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
