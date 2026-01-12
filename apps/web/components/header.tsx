"use client";

import { useState } from "react";
import Link from "next/link";
import { cn } from "@/lib/utils";
import { usePathname } from "next/navigation";
import { HeaderSearch } from "./header-search";
import { ProfileDropdown } from "./profile-dropdown";
import { ThemeToggle } from "./theme-toggle";
import { Code2, Menu, X, Home, LayoutGrid, Trophy } from "lucide-react";
import { AnimatePresence, motion } from "motion/react";

const NAV_ITEMS = [
  { label: "Home", href: "/", icon: Home },
  { label: "Problems", href: "/problems", icon: LayoutGrid },
  { label: "Contest", href: "/contest", icon: Trophy },
];

export function Header() {
  const pathname = usePathname();
  const [mobileOpen, setMobileOpen] = useState(false);

  return (
    <>
      <header className="sticky top-0 z-50 w-full bg-white/80 dark:bg-neutral-950/80 backdrop-blur-sm border-b">
        <nav className="mx-auto flex w-full items-center justify-between px-4 sm:px-6 py-2">
          <div className="flex h-full items-center gap-5">
            <Link href="/" className="flex items-center gap-2.5 group shrink-0">
              <div className="flex size-6 items-center justify-center rounded-md bg-accent transition-transform duration-200 group-hover:scale-105">
                <Code2 size={11} strokeWidth={2.5} />
              </div>
              <span className="text-[13px] font-semibold tracking-tight">
                CodeArena
              </span>
            </Link>

            <div className="hidden sm:flex items-center">
              {NAV_ITEMS.map(({ href, label }) => {
                const isActive =
                  href === "/" ? pathname === "/" : pathname.startsWith(href);
                return (
                  <Link
                    key={href}
                    href={href}
                    className={cn(
                      "relative inline-flex h-8 items-center px-3 text-[13px] font-medium rounded-md transition-colors duration-150",
                      isActive
                        ? "text-foreground"
                        : "text-muted-foreground hover:text-foreground"
                    )}
                  >
                    {label}
                    {isActive && (
                      <motion.span
                        layoutId="nav-active-indicator"
                        className="absolute bottom-0 inset-x-2 h-0.5 bg-primary rounded-full"
                        transition={{
                          type: "spring",
                          stiffness: 380,
                          damping: 30,
                        }}
                      />
                    )}
                  </Link>
                );
              })}
            </div>
          </div>

          <div className="flex items-center gap-2">
            <HeaderSearch />
            <ThemeToggle />
            <ProfileDropdown />

            <button
              className="sm:hidden ml-0.5 flex size-8 items-center justify-center rounded-lg text-muted-foreground hover:text-foreground hover:bg-muted transition-colors duration-150"
              onClick={() => setMobileOpen((v) => !v)}
              aria-label={mobileOpen ? "Close menu" : "Open menu"}
            >
              <AnimatePresence mode="wait" initial={false}>
                {mobileOpen ? (
                  <motion.span
                    key="x"
                    initial={{ rotate: -45, opacity: 0 }}
                    animate={{ rotate: 0, opacity: 1 }}
                    exit={{ rotate: 45, opacity: 0 }}
                    transition={{ duration: 0.14, ease: "easeOut" }}
                  >
                    <X size={17} strokeWidth={2} />
                  </motion.span>
                ) : (
                  <motion.span
                    key="menu"
                    initial={{ rotate: 45, opacity: 0 }}
                    animate={{ rotate: 0, opacity: 1 }}
                    exit={{ rotate: -45, opacity: 0 }}
                    transition={{ duration: 0.14, ease: "easeOut" }}
                  >
                    <Menu size={17} strokeWidth={2} />
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
              transition={{ duration: 0.18 }}
              className="fixed inset-0 z-40 sm:hidden bg-background/70 backdrop-blur-[6px]"
              onClick={() => setMobileOpen(false)}
            />

            <motion.div
              key="menu"
              initial={{ opacity: 0, y: -6 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -6 }}
              transition={{ duration: 0.2, ease: [0.16, 1, 0.3, 1] }}
              className="fixed top-12 inset-x-0 z-40 sm:hidden"
            >
              <div className="mx-3 mt-2 rounded-xl border border-border bg-card/98 backdrop-blur-sm shadow-xl shadow-black/10 overflow-hidden">
                <nav className="p-2">
                  {NAV_ITEMS.map(({ href, label, icon: Icon }, i) => {
                    const isActive =
                      href === "/"
                        ? pathname === "/"
                        : pathname.startsWith(href);
                    return (
                      <motion.div
                        key={href}
                        initial={{ opacity: 0, x: -8 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{
                          delay: i * 0.04,
                          duration: 0.2,
                          ease: [0.16, 1, 0.3, 1],
                        }}
                      >
                        <Link
                          href={href}
                          onClick={() => setMobileOpen(false)}
                          className={cn(
                            "flex items-center gap-3 px-3 py-2.5 rounded-lg text-[13px] font-medium transition-colors duration-150",
                            isActive
                              ? "bg-primary/10 text-primary"
                              : "text-muted-foreground hover:text-foreground hover:bg-muted/60"
                          )}
                        >
                          <Icon
                            size={15}
                            className={
                              isActive
                                ? "text-primary"
                                : "text-muted-foreground/50"
                            }
                          />
                          {label}
                          {isActive && (
                            <span className="ml-auto size-1.5 rounded-full bg-primary" />
                          )}
                        </Link>
                      </motion.div>
                    );
                  })}
                </nav>

                <div className="border-t border-border/60 p-2">
                  {[
                    { label: "Settings", href: "/settings" },
                    { label: "Profile", href: "/u/akash_codes" },
                  ].map(({ label, href }, i) => (
                    <motion.div
                      key={href}
                      initial={{ opacity: 0, x: -8 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{
                        delay: NAV_ITEMS.length * 0.04 + i * 0.04,
                        duration: 0.2,
                        ease: [0.16, 1, 0.3, 1],
                      }}
                    >
                      <Link
                        href={href}
                        onClick={() => setMobileOpen(false)}
                        className="flex items-center px-3 py-2.5 rounded-lg text-[13px] text-muted-foreground hover:text-foreground hover:bg-muted/60 transition-colors duration-150"
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
