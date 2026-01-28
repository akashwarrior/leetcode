"use client";

import dynamic from "next/dynamic";
import { useAtom, useAtomValue } from "jotai";
import { useTheme } from "next-themes";
import { useHydrateAtoms } from "jotai/utils";
import {
  codeAtom,
  editorThemeAtom,
  fontSizeAtom,
  languageAtom,
} from "@/lib/store";

const MonacoEditor = dynamic(() => import("@monaco-editor/react"), {
  ssr: false,
});

type CodeEditorProps = {
  initialCode: string;
};

export function CodeEditor({ initialCode }: CodeEditorProps) {
  useHydrateAtoms([[codeAtom, initialCode]]);
  const [code, setCode] = useAtom(codeAtom);
  const language = useAtomValue(languageAtom);
  const fontSize = useAtomValue(fontSizeAtom);
  const editorTheme = useAtomValue(editorThemeAtom);
  const { resolvedTheme } = useTheme();

  const theme = editorTheme === "system" ? resolvedTheme : editorTheme;

  return (
    <MonacoEditor
      value={code}
      onChange={(v) => setCode(v || "")}
      beforeMount={(monaco) => {
        monaco.editor.defineTheme("dark", {
          base: "vs-dark",
          inherit: true,
          rules: [
            { token: "comment", foreground: "51597d", fontStyle: "italic" },
            { token: "keyword", foreground: "bb9af7" },
            { token: "string", foreground: "9ece6a" },
            { token: "number", foreground: "ff9e64" },
            { token: "type", foreground: "0db9d7" },
            { token: "function", foreground: "7aa2f7" },
            { token: "variable", foreground: "c0caf5" },
            { token: "operator", foreground: "89ddff" },
          ],
          colors: {
            "editor.background": "#0a0a0a",
            "editor.foreground": "#d4d4d4",
            "editor.lineHighlightBackground": "#1e202e",
            "editor.selectionBackground": "#515c7e40",
            "editor.selectionHighlightBackground": "#515c7e44",
            "editorIndentGuide.background": "#232433",
            "editorIndentGuide.activeBackground": "#363b54",
          },
        });

        monaco.editor.defineTheme("light", {
          base: "vs",
          inherit: true,
          rules: [
            { token: "comment", foreground: "8b949e", fontStyle: "italic" },
            { token: "keyword", foreground: "9d7cd8" },
            { token: "string", foreground: "487d51" },
            { token: "number", foreground: "ff9e64" },
            { token: "type", foreground: "2d6f9e" },
            { token: "function", foreground: "3d8ed4" },
            { token: "variable", foreground: "414868" },
            { token: "operator", foreground: "9ca0b0" },
          ],
          colors: {
            "editor.background": "#ffffff",
            "editor.foreground": "#414868",
            "editor.lineHighlightBackground": "#f0f0f5",
            "editor.selectionBackground": "#b4beca",
            "editor.selectionHighlightBackground": "#b4beca50",
            "editorIndentGuide.background": "#e0e0e5",
            "editorIndentGuide.activeBackground": "#8b949e",
          },
        });
      }}
      language={language.toLowerCase()}
      theme={theme}
      options={{
        automaticLayout: true,
        minimap: { enabled: false },
        scrollBeyondLastLine: false,
        cursorSmoothCaretAnimation: "off",
        fontSize,
        padding: {
          top: 12,
          bottom: 12,
        },
        wordBasedSuggestions: "off",
        renderLineHighlight: "line",
        folding: false,
        lineNumbers: "on",
        lineDecorationsWidth: 20,
      }}
    />
  );
}
