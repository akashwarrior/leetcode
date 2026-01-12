"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { User, Settings, LogOut } from "lucide-react";
import { CURRENT_USER } from "@/lib/dummy-data";
import { Button } from "./ui/button";
import { signOut, useSession } from "@/lib/auth-client";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

export function ProfileDropdown() {
  const { data, isPending } = useSession();
  const router = useRouter();

  const user = data?.user;

  if (isPending || !user) {
    return (
      <Button asChild size="sm">
        <Link
          href="/sign-in"
          prefetch={false}
          className="text-white text-xs px-4 gradient-primary"
        >
          Sign In
        </Link>
      </Button>
    )
  }

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button
          size="icon-sm"
          variant="ghost"
          className="items-center justify-center bg-linear-to-br from-primary/20 to-transparent text-[10px] font-bold text-primary">
          {(data?.user?.name || CURRENT_USER.name)[0]}
        </Button>
      </DropdownMenuTrigger>

      <DropdownMenuContent align="end" className="w-48 rounded-lg">
        <div className="px-2 py-2 mb-1">
          <p className="text-sm font-medium truncate">
            {data?.user?.name || CURRENT_USER.name}
          </p>
          <p className="text-xs text-muted-foreground truncate">
            @{CURRENT_USER.userName}
          </p>
        </div>
        <DropdownMenuSeparator />
        <DropdownMenuItem asChild className="gap-2.5 rounded-md">
          <Link href={`/u/${CURRENT_USER.userName}`}>
            <User size={14} className="text-muted-foreground/40" />
            Profile
          </Link>
        </DropdownMenuItem>
        <DropdownMenuItem asChild className="gap-2.5 rounded-md">
          <Link href="/settings">
            <Settings size={14} className="text-muted-foreground/40" />
            Settings
          </Link>
        </DropdownMenuItem>
        <DropdownMenuSeparator />
        <DropdownMenuItem
          className="gap-2.5 text-destructive focus:text-destructive rounded-md"
          onClick={async () => {
            await signOut();
            router.push("/sign-in");
          }}
        >
          <LogOut size={14} className="text-destructive/40" />
          Sign out
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu >
  );
}
