"use client";

import { Sun, Moon } from "@phosphor-icons/react";
import { useTheme } from "next-themes";
import { Button } from "@/components/ui/button";
import type { VariantProps } from "class-variance-authority";
import { buttonVariants } from "@/components/ui/button";

export function ThemeToggle({
  size = "icon",
  variant = "ghost",
}: VariantProps<typeof buttonVariants>) {
  const { setTheme, resolvedTheme } = useTheme();

  return (
    <Button
      size={size}
      variant={variant}
      className="rounded-lg"
      onClick={() => setTheme(resolvedTheme === "dark" ? "light" : "dark")}
    >
      <Sun className="hidden dark:block" />
      <Moon className="block dark:hidden" />
    </Button>
  );
}
