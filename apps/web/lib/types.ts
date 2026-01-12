export type Difficulty = "EASY" | "MEDIUM" | "HARD";

export type SubmissionStatus =
  | "PENDING"
  | "ACCEPTED"
  | "WRONG_ANSWER"
  | "TIME_LIMIT_EXCEEDED"
  | "MEMORY_LIMIT_EXCEEDED"
  | "COMPILE_ERROR"
  | "RUNTIME_ERROR";

export type ProblemStatus = "ATTEMPTED" | "SOLVED";

export interface Tag {
  id: string;
  name: string;
}

export interface Language {
  id: number;
  name: string;
  judge0Id?: number;
  monacoId?: string;
}

export interface CodeSnippet {
  languageId: number;
  code: string;
}

export interface TestCase {
  id: string;
  input: string;
  output: string;
  isVisible: boolean;
}

export interface Problem {
  id: number;
  title: string;
  slug: string;
  description: string;
  difficulty: Difficulty;
  isPublished: boolean;
  submitCount: number;
  acceptedCount: number;
  timeLimitMs: number;
  memoryLimitKb: number;
  hints: string[];
  tags: Tag[];
}

export interface ProblemWithSnippets extends Problem {
  codeSnippets: CodeSnippet[];
  testCases: TestCase[];
}

export interface ProblemListItem {
  id: number;
  title: string;
  slug: string;
  difficulty: Difficulty;
  submitCount: number;
  acceptedCount: number;
  tags: Tag[];
  status?: ProblemStatus;
}

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

export interface ContestProblem {
  problemId: number;
  problem: ProblemListItem;
  score: number;
  order: number;
}

export interface ContestParticipant {
  userId: string;
  userName: string;
  rank?: number;
  score: number;
  penalty: number;
}

export interface User {
  id: string;
  name: string;
  email: string;
  image?: string;
  role: "USER" | "ADMIN";
}

export interface ProblemCategory {
  id: string;
  title: string;
  description: string;
  problemCount: number;
  slug: string;
  difficulty?: Difficulty;
}
