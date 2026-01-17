import type { Difficulty, Tag, Problem, ProblemStatus } from "@codearena/db";

export type DifficultyFilter = Difficulty | "ALL";

type BaseProblem = Pick<
  Problem,
  | "id"
  | "slug"
  | "title"
  | "difficulty"
  | "defaultCodeSnippet"
  | "totalSubmissions"
  | "totalAccepted"
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
  title: string;
  startTime: Date;
  problemCount: number;
};
