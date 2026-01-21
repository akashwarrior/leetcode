"use client";

import { useTheme } from "next-themes";
import { Toaster as Sonner, type ToasterProps } from "sonner";

const Toaster = ({ ...props }: ToasterProps) => {
  const { theme = "system" } = useTheme();

  return (
    <Sonner
      theme={theme as ToasterProps["theme"]}
      className="toaster group"
      style={
        {
          "--normal-bg": "var(--popover)",
          "--normal-text": "var(--popover-foreground)",
          "--normal-border": "var(--border)",
          "--border-radius": "8px",
        } as React.CSSProperties
      }
      toastOptions={{
        classNames: {
          toast:
            "font-sans text-sm border-border bg-popover text-popover-foreground",
          title: "font-medium text-foreground",
          description: "text-muted-foreground",
          success: "border-border",
          error: "border-destructive/30",
          loading: "border-border",
        },
      }}
      {...props}
    />
  );
};

export { Toaster };
