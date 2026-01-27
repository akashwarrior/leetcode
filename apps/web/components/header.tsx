"use client";

import { useState } from "react";
import Link from "next/link";
import { cn } from "@/lib/utils";
import { usePathname } from "next/navigation";
import { useSession } from "@/lib/auth/client";
import { HeaderSearch } from "./header-search";
import { ProfileDropdown } from "./profile-dropdown";
import { ThemeToggle } from "./theme-toggle";
import {
  CodeBlock,
  List,
  House,
  SquaresFour,
  Trophy,
  X,
} from "@phosphor-icons/react";
import { AnimatePresence, motion } from "motion/react";

const NAV_ITEMS = [
  { label: "Home", href: "/", icon: House },
  { label: "Problems", href: "/problems", icon: SquaresFour },
  { label: "Contests", href: "/contests", icon: Trophy },
];

export function Header() {
  const pathname = usePathname();
  const [mobileOpen, setMobileOpen] = useState(false);
  const { data: sessionData } = useSession();
  const profileHref = sessionData?.user
    ? `/u/${sessionData.user.username}`
    : "/sign-in";

  return (
    <>
      <header className="sticky top-0 z-50 w-full bg-background border-b border-border">
        <nav className="mx-auto flex w-full items-center justify-between px-4 sm:px-6 h-12">
          <div className="flex h-full items-center gap-6">
            <Link href="/" className="flex items-center gap-2 shrink-0">
              <div className="flex size-5 items-center justify-center rounded bg-primary">
                <CodeBlock
                  size={10}
                  className="text-primary-foreground"
                  weight="bold"
                />
              </div>
              <span className="text-sm font-medium tracking-tight text-primary">
                CodeArena
              </span>
            </Link>

            <div className="hidden sm:flex items-center gap-0.5">
              {NAV_ITEMS.map(({ href, label }) => {
                const isActive =
                  href === "/" ? pathname === "/" : pathname.startsWith(href);
                return (
                  <Link
                    key={href}
                    href={href}
                    className={cn(
                      "relative inline-flex h-7 items-center px-2.5 text-[0.8125rem] font-medium rounded-md transition-colors",
                      isActive
                        ? "bg-muted text-primary"
                        : "text-secondary hover:text-primary hover:bg-muted/50",
                    )}
                  >
                    {label}
                  </Link>
                );
              })}
            </div>
          </div>

          <div className="flex items-center gap-1">
            <HeaderSearch />
            <ThemeToggle />
            <ProfileDropdown />

            <button
              className="sm:hidden flex size-8 items-center justify-center rounded text-secondary hover:text-primary hover:bg-muted transition-colors"
              onClick={() => setMobileOpen((v) => !v)}
              aria-label={mobileOpen ? "Close menu" : "Open menu"}
            >
              <AnimatePresence mode="wait" initial={false}>
                {mobileOpen ? (
                  <motion.span
                    key="x"
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                    transition={{ duration: 0.1 }}
                  >
                    <X size={16} weight="bold" />
                  </motion.span>
                ) : (
                  <motion.span
                    key="menu"
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                    transition={{ duration: 0.1 }}
                  >
                    <List size={16} weight="bold" />
                  </motion.span>
                )}
              </AnimatePresence>
            </button>
          </div>
        </nav>
      </header>

      <AnimatePresence>
        {mobileOpen && (
          <>
            <motion.div
              key="backdrop"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.15 }}
              className="fixed inset-0 z-40 sm:hidden bg-background/80"
              onClick={() => setMobileOpen(false)}
            />

            <motion.div
              key="menu"
              initial={{ opacity: 0, y: -4 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -4 }}
              transition={{ duration: 0.15, ease: "easeOut" }}
              className="fixed top-12 inset-x-0 z-40 sm:hidden"
            >
              <div className="mx-3 mt-1 rounded-lg border border-border bg-card overflow-hidden">
                <nav className="p-1.5">
                  {NAV_ITEMS.map(({ href, label, icon: Icon }, i) => {
                    const isActive =
                      href === "/"
                        ? pathname === "/"
                        : pathname.startsWith(href);
                    return (
                      <motion.div
                        key={href}
                        initial={{ opacity: 0, x: -6 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{
                          delay: i * 0.03,
                          duration: 0.15,
                          ease: "easeOut",
                        }}
                      >
                        <Link
                          href={href}
                          onClick={() => setMobileOpen(false)}
                          className={cn(
                            "flex items-center gap-3 px-3 py-2 rounded text-sm font-medium transition-colors",
                            isActive
                              ? "bg-muted text-primary"
                              : "text-secondary hover:text-primary hover:bg-muted/50",
                          )}
                        >
                          <Icon size={14} />
                          {label}
                          {isActive && (
                            <span className="ml-auto size-1.5 rounded-full bg-primary" />
                          )}
                        </Link>
                      </motion.div>
                    );
                  })}
                </nav>

                <div className="border-t border-border p-1.5">
                  {[
                    { label: "Settings", href: "/settings" },
                    { label: "Profile", href: profileHref },
                  ].map(({ label, href }, i) => (
                    <motion.div
                      key={href}
                      initial={{ opacity: 0, x: -6 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{
                        delay: NAV_ITEMS.length * 0.03 + i * 0.03,
                        duration: 0.15,
                        ease: "easeOut",
                      }}
                    >
                      <Link
                        href={href}
                        onClick={() => setMobileOpen(false)}
                        className="flex items-center px-3 py-2 rounded text-sm text-secondary hover:text-primary hover:bg-muted/50 transition-colors"
                      >
                        {label}
                      </Link>
                    </motion.div>
                  ))}
                </div>
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </>
  );
}
