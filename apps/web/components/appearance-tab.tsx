"use client";

import { cn } from "@/lib/utils";
import { useTheme } from "next-themes";
import { Moon, Sun, Desktop } from "@phosphor-icons/react";
import { useAtom } from "jotai";
import { editorThemeAtom, fontSizeAtom } from "@/lib/store";

export function AppearanceTab() {
  const { theme, setTheme } = useTheme();
  const [editorTheme, setEditorTheme] = useAtom(editorThemeAtom);
  const [fontSize, setFontSize] = useAtom(fontSizeAtom);

  const themes = [
    { id: "light", label: "Light", icon: Sun },
    { id: "dark", label: "Dark", icon: Moon },
    { id: "system", label: "System", icon: Desktop },
  ];

  return (
    <div className="space-y-8">
      <div>
        <p className="font-mono-label mb-3">THEME</p>
        <div className="flex gap-2">
          {themes.map((t) => (
            <button
              key={t.id}
              onClick={() => setTheme(t.id)}
              className={cn(
                "flex flex-col items-center gap-2 p-4 rounded-lg border transition-colors flex-1",
                theme === t.id
                  ? "border-primary bg-muted text-primary"
                  : "border-border hover:border-border/80 text-secondary hover:text-primary",
              )}
            >
              <t.icon size={16} />
              <span className="text-xs font-medium">{t.label}</span>
            </button>
          ))}
        </div>
      </div>

      <div className="border-t border-border pt-8">
        <p className="font-mono-label mb-4">EDITOR PREFERENCES</p>

        <div className="space-y-5">
          <div className="flex items-center justify-between gap-4">
            <div>
              <p className="text-sm text-primary">Font size</p>
              <p className="text-xs text-secondary mt-0.5">
                Editor code font scale
              </p>
            </div>
            <div className="flex items-center gap-2">
              <button
                onClick={() => {
                  setFontSize((s) => String(Math.max(10, Number(s) - 1)));
                }}
                className="flex size-8 items-center justify-center rounded-lg border border-border hover:bg-muted text-sm transition-colors text-primary"
                title="Decrease font size"
              >
                −
              </button>
              <span className="text-sm font-mono tabular-nums w-8 text-center text-primary">
                {fontSize}
              </span>
              <button
                onClick={() => {
                  setFontSize((s) => String(Math.min(24, Number(s) + 1)));
                }}
                className="flex size-8 items-center justify-center rounded-lg border border-border hover:bg-muted text-sm transition-colors text-primary"
                title="Increase font size"
              >
                +
              </button>
            </div>
          </div>

          <div className="flex items-center justify-between gap-4">
            <div>
              <p className="text-sm text-primary">Editor theme</p>
              <p className="text-xs text-secondary mt-0.5">
                Syntax highlighting theme
              </p>
            </div>
            <select
              value={editorTheme}
              onChange={(e) => {
                setEditorTheme(e.target.value);
              }}
              className="h-8 rounded-lg border border-border bg-card px-2.5 text-xs font-medium outline-none cursor-pointer text-primary"
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
