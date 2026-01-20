"use client";

import { cn } from "@/lib/utils";
import { useTheme } from "next-themes";
import { toast } from "sonner";
import { Moon, Sun, Monitor } from "lucide-react";
import { useAtom } from "jotai";
import { editorThemeAtom, fontSizeAtom } from "@/lib/store";

export function AppearanceTab() {
  const { theme, setTheme } = useTheme();
  const [editorTheme, setEditorTheme] = useAtom(editorThemeAtom);
  const [fontSize, setFontSize] = useAtom(fontSizeAtom);

  const themes = [
    { id: "light", label: "Light", icon: Sun },
    { id: "dark", label: "Dark", icon: Moon },
    { id: "system", label: "System", icon: Monitor },
  ];

  return (
    <div className="space-y-6">
      <div>
        <p className="text-sm font-medium mb-1">Theme</p>
        <p className="text-xs text-muted-foreground mb-3">
          Choose how CodeArena looks
        </p>
        <div className="flex gap-2">
          {themes.map((t) => (
            <button
              key={t.id}
              onClick={() => {
                setTheme(t.id);
                toast.success(`${t.label} theme applied`);
              }}
              className={cn(
                "flex flex-col items-center gap-2 p-3 rounded-lg border transition-colors flex-1",
                theme === t.id
                  ? "border-primary bg-primary/5 text-primary"
                  : "border-border hover:border-foreground/20 text-muted-foreground hover:text-foreground",
              )}
            >
              <t.icon size={16} />
              <span className="text-xs font-medium">{t.label}</span>
            </button>
          ))}
        </div>
      </div>

      <div className="border-t border-border pt-6">
        <p className="text-sm font-medium mb-1">Editor Preferences</p>
        <p className="text-xs text-muted-foreground mb-4">
          Set up your problem solving environment
        </p>

        <div className="space-y-4">
          <div className="flex items-center justify-between gap-4">
            <div>
              <p className="text-sm">Font size</p>
              <p className="text-xs text-muted-foreground mt-0.5">
                Editor code font scale
              </p>
            </div>
            <div className="flex items-center gap-2">
              <button
                onClick={() => {
                  setFontSize((s) => String(Math.max(10, Number(s) - 1)));
                  toast.success("Font size decreased");
                }}
                className="flex size-7 items-center justify-center rounded-md border border-border hover:bg-muted text-sm transition-colors"
                title="Decrease font size"
              >
                −
              </button>
              <span className="text-sm font-mono tabular-nums w-8 text-center">
                {fontSize}
              </span>
              <button
                onClick={() => {
                  setFontSize((s) => String(Math.min(24, Number(s) + 1)));
                  toast.success("Font size increased");
                }}
                className="flex size-7 items-center justify-center rounded-md border border-border hover:bg-muted text-sm transition-colors"
                title="Increase font size"
              >
                +
              </button>
            </div>
          </div>

          <div className="flex items-center justify-between gap-4">
            <div>
              <p className="text-sm">Editor theme</p>
              <p className="text-xs text-muted-foreground mt-0.5">
                Syntax highlighting theme
              </p>
            </div>
            <select
              value={editorTheme}
              onChange={(e) => {
                setEditorTheme(e.target.value);
                toast.success("Editor theme changed to " + e.target.value);
              }}
              className="h-8 rounded-md border border-border bg-card px-2.5 text-xs font-medium outline-none cursor-pointer text-foreground"
            >
              <option value="dark">Dark (Default)</option>
              <option value="monokai">Monokai</option>
              <option value="solarized">Solarized</option>
              <option value="github">GitHub</option>
            </select>
          </div>
        </div>
      </div>
    </div>
  );
}
