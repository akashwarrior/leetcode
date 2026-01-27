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

  const theme =
    (editorTheme === "system" ? resolvedTheme : editorTheme) === "dark"
      ? "vs-dark"
      : "vs-light";

  return (
    <MonacoEditor
      value={code}
      onChange={(v) => setCode(v || "")}
      beforeMount={(monaco) => {
        if (theme === "vs-dark") {
          monaco.editor.defineTheme("vs-dark", {
            base: "vs-dark",
            inherit: true,
            rules: [],
            colors: { "editor.background": "#0a0a0a" },
          });
        }
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
