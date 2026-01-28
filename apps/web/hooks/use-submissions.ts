import type { Submission } from "@codearena/db";
import { useCallback, useRef } from "react";
import useSWRInfinite from "swr/infinite";

const SUBMISSIONS_PAGE_SIZE = 15;

export function getSubmissionsKey(
  problemId: string,
  page = 0,
  limit = SUBMISSIONS_PAGE_SIZE,
) {
  if (!problemId) {
    return null;
  }

  const params = new URLSearchParams({
    problemId,
    page: String(page),
    limit: String(limit),
  });

  return `/api/submissions?${params.toString()}`;
}

const fetcher = async (url: string) => {
  const response = await fetch(url);
  if (!response.ok) {
    throw new Error("Failed to load submissions.");
  }

  return response.json();
};

export function useSubmissions(problemId: string) {
  const isFetchingMoreRef = useRef(false);

  const { data, error, isLoading, isValidating, setSize, mutate } =
    useSWRInfinite<Submission[]>(
      (index) => getSubmissionsKey(problemId, index),
      fetcher,
      {
        revalidateOnMount: true,
        keepPreviousData: true,
        errorRetryCount: 3,
        errorRetryInterval: 2000,
      },
    );

  const submissions = data?.flat() ?? [];
  const hasMore = data?.length
    ? data[data.length - 1].length === SUBMISSIONS_PAGE_SIZE
    : false;

  const loadMore = useCallback(async () => {
    if (
      !hasMore ||
      isLoading ||
      isValidating ||
      error ||
      isFetchingMoreRef.current
    ) {
      return;
    }

    isFetchingMoreRef.current = true;
    try {
      await setSize((prev) => prev + 1);
    } finally {
      isFetchingMoreRef.current = false;
    }
  }, [hasMore, isLoading, isValidating, error, setSize]);

  return {
    data: submissions,
    error,
    isLoading,
    isLoadingMore: isValidating && !isLoading,
    hasMore,
    loadMore,
    mutate,
  };
}
