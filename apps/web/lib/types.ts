import type {
  Difficulty,
  Tag,
  Problem,
  ProblemStatus,
  SubmissionStatus,
} from "@codearena/db";

export type DifficultyFilter = Difficulty | "ALL";

type BaseProblem = Pick<
  Problem,
  "id" | "slug" | "title" | "difficulty" | "totalSubmissions" | "totalAccepted"
>;

export interface ProblemListItem extends BaseProblem {
  tags: Tag[];
  status?: ProblemStatus;
}

export type ProblemTotals = {
  easy: number;
  medium: number;
  hard: number;
  total: number;
};

export type UpcomingContest = {
  id: string;
  slug: string;
  title: string;
  startTime: Date;
  problemCount: number;
};

type GenericValue = number | string | boolean;

export type TestCase = {
  input: Record<string, GenericValue | GenericValue[]>;
  expectedAnswer?: GenericValue | GenericValue[] | null;
  actualAnswer?: GenericValue | GenericValue[] | null;
  status?: "PASSED" | "FAILED";
  output?: string | null;
};

export type Execution = {
  id: string;
  status: SubmissionStatus;
  attemptCount: number;
  passedTestCases: number;
  totalTestCases: number;
  testCases: TestCase[];
  memoryInKb?: number;
  timeInMs?: number;
  errorMessage: string | null;
};
