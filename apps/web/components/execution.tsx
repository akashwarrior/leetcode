"use client";

import { cn } from "@/lib/utils";
import { useAtomValue } from "jotai";
import { executionAtom } from "@/lib/store";
import { SpinnerIcon } from "@phosphor-icons/react/dist/ssr/Spinner";
import { Testcases } from "./testcases";

export function Execution() {
  const execution = useAtomValue(executionAtom);
  const status = execution?.status;

  if (!status || status === "QUEUED" || status === "RUNNING") {
    return (
      <div className="flex items-center justify-center gap-2 py-5 text-[13px] text-secondary h-full">
        {!status ? (
          <p className="text-[13px] leading-relaxed text-secondary">
            Run or submit to see results.
          </p>
        ) : (
          <>
            <SpinnerIcon
              size={22}
              className="shrink-0 animate-spin opacity-70"
            />
            <span>{status}…</span>
          </>
        )}
      </div>
    );
  }

  const statusColor =
    status === "ACCEPTED"
      ? "text-success"
      : status === "TIME_LIMIT_EXCEEDED" || status === "MEMORY_LIMIT_EXCEEDED"
        ? "text-warning"
        : "text-error";

  return (
    <div className="flex p-4 flex-col gap-3">
      <section className="overflow-hidden rounded-md border border-border bg-background">
        <div className="px-3 py-2.5">
          <p className="font-mono-label">Outcome</p>
          <p
            className={cn(
              "mt-1 text-[15px] font-semibold leading-tight tracking-tight capitalize",
              statusColor,
            )}
          >
            {status.replaceAll("_", " ").toLowerCase()}
          </p>
        </div>

        <div className="grid grid-cols-[minmax(0,1fr)_auto] gap-x-4 gap-y-2 border-t border-border px-3 py-2.5 text-[13px]">
          <span className="text-secondary">Tests passed</span>
          <span className="tabular-nums font-medium text-primary">
            {execution.passedTestCases}
            <span className="font-normal text-secondary"> / </span>
            {execution.totalTestCases}
          </span>

          <span className="text-secondary">Runtime</span>
          <span className="tabular-nums text-primary">
            {execution.timeInMs != null ? `${execution.timeInMs} ms` : "—"}
          </span>

          <span className="text-secondary">Memory</span>
          <span className="tabular-nums text-primary">
            {execution.memoryInKb != null
              ? `${(execution.memoryInKb / 1024).toFixed(1)} MB`
              : "—"}
          </span>
        </div>
      </section>

      {execution.errorMessage && (
        <div className="overflow-hidden rounded-md border border-error/25 bg-error/6 p-3">
          <p className="font-mono-label text-error">Error</p>
          <pre className="mt-1.5 max-h-64 overflow-y-auto text-xs font-mono leading-relaxed whitespace-pre-wrap wrap-break-word text-error">
            {execution.errorMessage}
          </pre>
        </div>
      )}

      {execution.testCases.length > 0 && (
        <Testcases testCases={execution.testCases} />
      )}
    </div>
  );
}
