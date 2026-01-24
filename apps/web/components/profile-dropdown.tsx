"use client";

import { cn } from "@/lib/utils";
import Link from "next/link";
import { mutate } from "swr";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { User, Gear, SignOut } from "@phosphor-icons/react";
import { signOut, useSession } from "@/lib/auth/client";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import Image from "next/image";

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
          <Link href="/sign-in" prefetch={false} className="text-xs px-4">
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
            className={cn(
              "items-center justify-center overflow-hidden rounded",
              user.image
                ? "bg-transparent"
                : "bg-muted text-[10px] font-medium text-primary ",
            )}
          >
            {user.image ? (
              <Image src={user.image} alt="Avatar" width={72} height={72} />
            ) : (
              user.name.charAt(0)
            )}
          </Button>
        }
      />

      <DropdownMenuContent align="end" className="w-48 rounded-lg">
        <div className="px-2 py-2 mb-1">
          <p className="text-sm font-medium truncate text-primary">
            {user.name}
          </p>
          <p className="text-xs text-primary/70 truncate">@{user.username}</p>
        </div>
        <DropdownMenuSeparator />
        <DropdownMenuItem
          className="gap-2.5"
          nativeButton={false}
          render={
            <Link href={`/u/${user.username}`}>
              <User size={14} className="text-foreground/50" />
              Profile
            </Link>
          }
        />

        <DropdownMenuItem
          className="gap-2.5"
          nativeButton={false}
          render={
            <Link href="/settings">
              <Gear size={14} className="text-foreground/50" />
              Settings
            </Link>
          }
        />
        <DropdownMenuSeparator />
        <DropdownMenuItem
          variant="destructive"
          className="gap-2.5"
          onClick={async () => {
            await signOut();
            await mutate("session");
            router.refresh();
          }}
        >
          <SignOut size={14} />
          Sign out
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
