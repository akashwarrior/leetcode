import type { TestCase } from "@/lib/types";
import { cn } from "@/lib/utils";
import { CopyButton } from "./ui/copy-button";
import { CheckCircleIcon, XCircleIcon } from "@phosphor-icons/react/ssr";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";

const preBlock =
  "group relative min-h-10! w-full max-w-full overflow-x-auto rounded-md bg-muted/40 px-3! py-2! pr-11 font-mono text-xs leading-relaxed text-primary";

const copyBtn =
  "absolute right-2 top-1/2 -translate-y-1/2! opacity-0 transition-opacity group-hover:opacity-100";

export function Testcases({ testCases }: { testCases: TestCase[] }) {
  return (
    <Tabs defaultValue={0} className="px-2 flex-1 overflow-y-auto p-5 pb-6">
      <TabsList
        className={cn(
          "mb-2 flex-wrap gap-1 bg-transparent p-0 h-fit!",
          testCases.length === 1 && "hidden",
        )}
      >
        {testCases.map((tc, idx) => (
          <TabsTrigger
            key={`tc-trigger-${idx}`}
            value={idx}
            className="rounded-md px-4 text-sm font-medium"
          >
            {tc.status === "PASSED" && (
              <CheckCircleIcon size={14} className="status-success" />
            )}
            {tc.status === "FAILED" && (
              <XCircleIcon size={14} className="text-error" />
            )}
            Case {idx + 1}
          </TabsTrigger>
        ))}
      </TabsList>

      {testCases.map((tc, idx) => (
        <TabsContent
          value={idx}
          key={`tc-data-${idx}`}
          className="flex flex-col gap-4"
        >
          {[
            { label: "INPUT", value: tc.input },
            { label: "OUTPUT", value: tc.output },
            {
              label: "EXPECTED OUTPUT",
              value: tc.expectedAnswer,
            },
            {
              label: "ACTUAL OUTPUT",
              value: tc.actualAnswer,
            },
          ].map(
            ({ label, value }) =>
              value && (
                <div key={label} className="flex flex-col gap-2">
                  <p className="font-mono-label">{label}</p>
                  {value &&
                  typeof value === "object" &&
                  Object.keys(value)[0] !== "0" ? (
                    Object.entries(value).map(([key, value]) => (
                      <pre
                        key={key}
                        className={cn(preBlock, "flex flex-col gap-1")}
                      >
                        <span className="text-secondary">{key}</span>
                        <span className="break-all text-sm">
                          {typeof value === "object"
                            ? JSON.stringify(value, null, 0)
                            : value.toString()}
                        </span>
                        <CopyButton
                          size="icon-lg"
                          variant="ghost"
                          value={
                            typeof value === "object"
                              ? JSON.stringify(value, null, 0)
                              : value.toString()
                          }
                          className={copyBtn}
                        />
                      </pre>
                    ))
                  ) : (
                    <pre
                      className={cn(
                        preBlock,
                        "flex items-center whitespace-pre-wrap break-all text-sm",
                      )}
                    >
                      {typeof value === "object"
                        ? JSON.stringify(value, null, 0)
                        : value.toString()}
                      <CopyButton
                        size="icon-lg"
                        variant="ghost"
                        value={
                          typeof value === "object"
                            ? JSON.stringify(value, null, 0)
                            : value.toString()
                        }
                        className={copyBtn}
                      />
                    </pre>
                  )}
                </div>
              ),
          )}
        </TabsContent>
      ))}
    </Tabs>
  );
}
