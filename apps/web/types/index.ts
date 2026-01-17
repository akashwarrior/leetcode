import type { Language } from "@codearena/db";

export type SubmissionStatus =
  | "PENDING"
  | "ACCEPTED"
  | "WRONG_ANSWER"
  | "TIME_LIMIT_EXCEEDED"
  | "MEMORY_LIMIT_EXCEEDED"
  | "COMPILE_ERROR"
  | "RUNTIME_ERROR";

export interface Submission {
  id: string;
  code: string;
  status: SubmissionStatus;
  memory?: number;
  time?: number;
  output?: string;
  errMessage?: string;
  createdAt: Date;
  languageId: number;
  language?: Language;
}

export interface Contest {
  id: string;
  name: string;
  startTime: Date;
  endTime: Date;
  problemCount?: number;
  participantCount: number;
}

export * from "./problem-types";
