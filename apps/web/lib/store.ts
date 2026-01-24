import { Language } from "@codearena/db";
import { atom } from "jotai";
import { atomWithStorage } from "jotai/utils";

// Editor related atoms
type EditorTheme = "dark" | "light" | "system";

export const editorThemeAtom = atomWithStorage<EditorTheme>(
  "editorTheme",
  "dark",
);
export const fontSizeAtom = atomWithStorage<number>("fontSize", 14);

export const codeAtom = atom<string>("");

export const languageAtom = atom<Language>("JAVASCRIPT");

export const defaultCodeSnippetsAtom = atom<
  { languageId: number; code: string }[]
>([]);
