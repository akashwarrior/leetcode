import type { Submission } from "@codearena/db";
import useSWR from "swr";

export function getSubmissionsKey(problemId: string) {
  const params = new URLSearchParams({ problemId });
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
  return useSWR<Submission[]>(() => getSubmissionsKey(problemId), fetcher, {
    revalidateOnMount: true,
    errorRetryCount: 3,
    errorRetryInterval: 2000,
  });
}
