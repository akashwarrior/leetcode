"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { Button } from "./ui/button";
import { PROBLEM_LIST } from "@/lib/dummy-data";
import { cn } from "@/lib/utils";
import { Kbd } from "@/components/ui/kbd";
import {
  Search,
  ArrowRight,
  FileText,
  Home,
  Trophy,
  Settings,
  User,
} from "lucide-react";
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
        className="hidden sm:flex h-8 w-52 items-center justify-between rounded-lg border border-border bg-muted/20 px-3 text-xs text-muted-foreground hover:bg-muted/40 hover:text-foreground transition-colors"
        onClick={() => setOpen(true)}
      >
        <div className="flex items-center gap-2">
          <Search size={13} className="text-muted-foreground/50" />
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
        <Search size={16} />
      </Button>

      <CommandDialog open={open} onOpenChange={setOpen}>
        <Command className="rounded-lg border-0" loop>
          <CommandInput
            placeholder="Type a command or search..."
            className="text-sm"
          />
          <CommandList className="max-h-95">
            <CommandEmpty className="py-8 text-center text-sm text-muted-foreground">
              No results found.
            </CommandEmpty>

            <CommandGroup heading="Quick links">
              {[
                { label: "Home", href: "/", icon: Home },
                { label: "Problems", href: "/problems", icon: FileText },
                { label: "Contest", href: "/contest", icon: Trophy },
                { label: "Settings", href: "/settings", icon: Settings },
                { label: "Profile", href: "/u/akashwarrior", icon: User },
              ].map((link) => (
                <CommandItem
                  key={link.href}
                  onSelect={() => {
                    router.push(link.href);
                    setOpen(false);
                  }}
                  className="gap-3 py-2 rounded-md"
                >
                  <link.icon size={14} className="text-muted-foreground/40" />
                  <span className="text-sm">{link.label}</span>
                  <CommandShortcut>
                    <ArrowRight
                      size={12}
                      className="text-muted-foreground/20"
                    />
                  </CommandShortcut>
                </CommandItem>
              ))}
            </CommandGroup>

            <CommandSeparator />

            <CommandGroup heading="Problems">
              {PROBLEM_LIST.slice(0, 6).map((p) => (
                <CommandItem
                  key={p.id}
                  value={p.title}
                  onSelect={() => router.push(`/problems/${p.slug}`)}
                  className="gap-3 py-2 rounded-md"
                >
                  <FileText
                    size={14}
                    className="text-muted-foreground/40 shrink-0"
                  />
                  <div className="flex-1 truncate text-sm">{p.title}</div>
                  <span
                    className={cn(
                      "text-[10px] font-medium shrink-0",
                      p.difficulty === "EASY" && "text-emerald-500",
                      p.difficulty === "MEDIUM" && "text-amber-500",
                      p.difficulty === "HARD" && "text-rose-500",
                    )}
                  >
                    {p.difficulty.toLowerCase()}
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
