import type { DifficultyFilter } from "@/types";

export const DEFAULT_PAGE_SIZE = 10;

type ProblemsFilterParams = {
  searchQuery?: string;
  difficulty?: DifficultyFilter;
  tags?: string[];
};

export function createProblemsUrl(idx: number, args?: ProblemsFilterParams) {
  const params = new URLSearchParams({
    skip: String(idx * DEFAULT_PAGE_SIZE),
    limit: String(DEFAULT_PAGE_SIZE),
    ...(args?.searchQuery?.trim() && { search: args.searchQuery }),
    ...(args?.difficulty &&
      args.difficulty !== "ALL" && { difficulty: args.difficulty }),
  });

  if (args?.tags?.length) {
    args.tags.forEach((tag) => {
      params.append("tags", tag);
    });
  }

  return `/api/problems?${params.toString()}`;
}

export function getProblemsKey(args?: ProblemsFilterParams) {
  return (idx: number) => createProblemsUrl(idx, args);
}
