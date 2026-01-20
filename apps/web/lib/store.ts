import { atomWithStorage } from "jotai/utils";
import { atom } from "jotai";

// Set of contest IDs the user has registered for
export const registeredContestsAtom = atom<Set<string>>(new Set<string>());

// Solved problems set (simulated)
export const solvedProblemsAtom = atom<Set<string>>(
  new Set<string>(["two-sum", "merge-intervals"]),
);

// Currently running submission state
export const submissionStatusAtom = atom<
  "idle" | "running" | "accepted" | "wrong" | "tle"
>("idle");

// Settings save state
export const settingsSavedAtom = atom<boolean>(false);

// Editor theme and font size
export const editorThemeAtom = atomWithStorage("editorTheme", "dark");
export const fontSizeAtom = atomWithStorage("fontSize", "14");
