import { codeAtom, executionAtom, languageAtom } from "@/lib/store";
import type { Execution } from "@/lib/types";
import { useAtomValue, useSetAtom } from "jotai";
import { useEffect, useState } from "react";
import { toast } from "sonner";
import useSWR from "swr";

type FuncPayload = {
  type: "run" | "submit";
  url: string;
};

const fetcher = (url: string) => fetch(url).then((res) => res.json());

export function useExecution({ problemId }: { problemId: string }) {
  const code = useAtomValue(codeAtom);
  const language = useAtomValue(languageAtom);
  const setExecution = useSetAtom(executionAtom);

  const [executionId, setExecutionId] = useState<string | null>(null);
  const [isExecuting, setIsExecuting] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const { data: execution } = useSWR<Execution>(
    executionId ? `/api/executions/${executionId}` : null,
    fetcher,
    {
      refreshInterval: 500,
      revalidateOnMount: false,
      errorRetryCount: 3,
    },
  );

  useEffect(() => {
    if (!execution) return;
    setExecution(execution);

    if (execution.status !== "QUEUED" && execution.status !== "RUNNING") {
      setIsExecuting(false);
      setIsSubmitting(false);
      setExecutionId(null);
    }
  }, [execution]);

  async function func({ type, url }: FuncPayload) {
    if (type === "run") {
      setIsExecuting(true);
    } else {
      setIsSubmitting(true);
    }
    try {
      const response = await fetch(url, {
        method: "POST",
        body: JSON.stringify({
          problemId,
          language,
          code,
        }),
      });

      const payload = (await response.json()) as {
        id?: string;
        message?: string;
      };

      if (!payload.id || !response.ok) {
        throw new Error(payload?.message ?? `Unable to ${type} code`);
      }
      setExecutionId(payload.id);
    } catch (error) {
      if (type === "run") {
        setIsExecuting(false);
      } else {
        setIsSubmitting(false);
      }
      toast.error(
        error instanceof Error ? error.message : `Unable to ${type} code`,
      );
    }
  }

  return {
    isExecuting,
    isSubmitting,
    runCode: () => func({ type: "run", url: "/api/executions" }),
    submitCode: () => func({ type: "submit", url: "/api/submissions" }),
  };
}
