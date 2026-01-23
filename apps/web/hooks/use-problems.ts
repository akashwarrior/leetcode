"use client";

import type { DifficultyFilter, ProblemListItem } from "@/lib/types";
import { DEFAULT_PAGE_SIZE, getProblemsKey } from "@/lib/problems-keys";
import { useEffect, useRef, useState } from "react";
import useSWRInfinite from "swr/infinite";

const DEBOUNCE_MS = 300;

const fetcher = async (url: string) => {
  const response = await fetch(url);

  if (!response.ok) {
    throw new Error("Failed to load problems.");
  }

  return response.json();
};

export function useProblems({ initialTags }: { initialTags?: string[] }) {
  const [search, setSearchRaw] = useState<string>("");
  const [debouncedSearch, setDebouncedSearch] = useState<string>("");
  const [difficulty, setDifficulty] = useState<DifficultyFilter>("ALL");
  const [tags, setTags] = useState<string[]>(initialTags ?? []);
  const debounceTimer = useRef<ReturnType<typeof setTimeout>>(null);

  const setSearch = (value: string) => {
    setSearchRaw(value);
    if (debounceTimer.current) {
      clearTimeout(debounceTimer.current);
    }
    debounceTimer.current = setTimeout(() => {
      setDebouncedSearch(value);
    }, DEBOUNCE_MS);
  };

  useEffect(() => {
    return () => {
      if (debounceTimer.current) {
        clearTimeout(debounceTimer.current);
      }
    };
  }, []);

  const { data, error, isValidating, isLoading, setSize, mutate } =
    useSWRInfinite<ProblemListItem[]>(
      getProblemsKey({ searchQuery: debouncedSearch, difficulty, tags }),
      fetcher,
      {
        revalidateOnMount: false,
        keepPreviousData: true,
        errorRetryCount: 3,
        parallel: true,
      },
    );

  const hasMore = data?.length
    ? data[data.length - 1].length === DEFAULT_PAGE_SIZE
    : false;

  const loadMore = () => {
    if (!hasMore || isLoading || isValidating || error) {
      return;
    }
    setSize((prev) => prev + 1);
  };

  return {
    search,
    setSearch,
    difficulty,
    setDifficulty,
    tags,
    setTags,
    problems: data?.flat() ?? [],
    hasMore,
    error,
    isLoading: isLoading || isValidating,
    loadMore,
    mutate,
  };
}
