"use client";

import { Sun, Moon } from "lucide-react";
import { useTheme } from "next-themes";
import { Button, buttonVariants } from "@/components/ui/button";
import { VariantProps } from "class-variance-authority";

export function ThemeToggle({ size = "icon", variant = "ghost" }: VariantProps<typeof buttonVariants>) {
  const { setTheme, resolvedTheme } = useTheme();

  return (
    <Button
      size={size}
      variant={variant}
      className="rounded-lg"
      onClick={() => setTheme(resolvedTheme === "dark" ? "light" : "dark")}
    >
      <Sun className="hidden dark:block" strokeWidth={1.5} />
      <Moon className="block dark:hidden" strokeWidth={1.5} />
    </Button>
  );
}
