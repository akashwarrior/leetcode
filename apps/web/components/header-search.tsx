"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { Button } from "./ui/button";
import { cn } from "@/lib/utils";
import { Kbd } from "@/components/ui/kbd";
import { useProblems } from "@/hooks/use-problems";
import { useSession } from "@/lib/auth/client";
import {
  MagnifyingGlass,
  ArrowRight,
  FileText,
  House,
  Trophy,
  Gear,
  User,
} from "@phosphor-icons/react";
import {
  Command,
  CommandDialog,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
  CommandSeparator,
  CommandShortcut,
} from "./ui/command";

export function HeaderSearch() {
  const [open, setOpen] = useState(false);
  const { problems, search, setSearch } = useProblems();
  const { data: session } = useSession();
  const router = useRouter();

  useEffect(() => {
    function onKeyDown(e: KeyboardEvent) {
      if ((e?.metaKey || e?.ctrlKey) && e?.key === "k") {
        e?.preventDefault();
        setOpen((open) => !open);
      }
    }
    document.addEventListener("keydown", onKeyDown);
    return () => document.removeEventListener("keydown", onKeyDown);
  }, []);

  return (
    <>
      <Button
        variant="ghost"
        className="hidden sm:flex h-8 w-52 items-center justify-between rounded-lg border border-border bg-muted/20 px-3 text-xs text-secondary hover:bg-muted/40 hover:text-primary transition-colors"
        onClick={() => setOpen(true)}
      >
        <div className="flex items-center gap-2">
          <MagnifyingGlass size={13} className="text-disabled" />
          <span>Search...</span>
        </div>
        <Kbd className="text-[10px]">⌘K</Kbd>
      </Button>

      <Button
        size="icon"
        variant="ghost"
        className="sm:hidden rounded-lg"
        onClick={() => setOpen(true)}
      >
        <MagnifyingGlass size={16} />
      </Button>

      <CommandDialog
        className="rounded-xl!"
        open={open}
        onOpenChange={(val) => {
          setOpen(val);
          if (!val) {
            setSearch("");
          }
        }}
      >
        <Command loop>
          <CommandInput
            value={search}
            onValueChange={setSearch}
            className="text-sm"
            placeholder="Type a command or search..."
          />
          <CommandList className="max-h-95">
            <CommandEmpty className="py-8 text-center text-sm text-secondary">
              No results found.
            </CommandEmpty>

            <CommandGroup heading="Quick links">
              {[
                { label: "Home", href: "/", icon: House },
                { label: "Problems", href: "/problems", icon: FileText },
                { label: "Contest", href: "/contest", icon: Trophy },
                { label: "Settings", href: "/settings", icon: Gear },
                {
                  label: "Profile",
                  href: session?.user
                    ? `/u/${session.user.username}`
                    : "/sign-in",
                  icon: User,
                },
              ].map((link) => (
                <CommandItem
                  key={link.href}
                  onSelect={() => {
                    router.push(link.href);
                    setOpen(false);
                  }}
                  className="gap-3 py-2 rounded"
                >
                  <link.icon size={14} className="text-disabled" />
                  <span className="text-sm text-primary">{link.label}</span>
                  <CommandShortcut>
                    <ArrowRight size={12} className="text-disabled" />
                  </CommandShortcut>
                </CommandItem>
              ))}
            </CommandGroup>

            <CommandSeparator />

            <CommandGroup heading="Problems">
              {problems?.map((p) => (
                <CommandItem
                  key={p.id}
                  value={p.title}
                  onSelect={() => router.push(`/problems/${p.slug}`)}
                  className="gap-3 py-2 rounded"
                >
                  <FileText size={14} className="text-disabled shrink-0" />
                  <div className="flex-1 truncate text-sm text-primary">
                    {p.title}
                  </div>
                  <span
                    className={cn(
                      "text-[10px] font-mono uppercase tracking-widest shrink-0",
                      p.difficulty === "EASY" && "status-success",
                      p.difficulty === "MEDIUM" && "status-warning",
                      p.difficulty === "HARD" && "status-error",
                    )}
                  >
                    {p.difficulty?.toLowerCase()}
                  </span>
                </CommandItem>
              ))}
            </CommandGroup>
          </CommandList>
        </Command>
      </CommandDialog>
    </>
  );
}
