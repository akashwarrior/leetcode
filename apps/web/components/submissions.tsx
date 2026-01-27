"use client";

import { toast } from "sonner";
import { useSetAtom } from "jotai";
import { cn } from "@/lib/utils";
import { codeAtom, languageAtom } from "@/lib/store";
import { formatDistanceToNow } from "date-fns";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import { useSubmissions } from "@/hooks/use-submissions";

import type { Language, SubmissionStatus } from "@codearena/db";
import { createHighlighterCore } from "shiki/core";
import { createJavaScriptRegexEngine } from "shiki/engine/javascript";
import github_dark from "shiki/themes/github-dark.mjs";
import github_light from "shiki/themes/github-light.mjs";
import cpp from "shiki/langs/cpp.mjs";
import javascript from "shiki/langs/javascript.mjs";

import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from "@/components/ui/tooltip";

import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";

import {
  CheckCircleIcon,
  XCircleIcon,
  WarningIcon as AlertTriangleIcon,
  ClockIcon,
  CpuIcon,
  SpinnerIcon as Loader2Icon,
  CodeIcon,
  CopyIcon,
  SwapIcon as ReplaceIcon,
  type Icon,
} from "@phosphor-icons/react";

const STATUS_CONFIG: Record<
  SubmissionStatus,
  {
    icon: Icon;
    color: `text-${"success" | "error" | "warning" | "secondary"}`;
  }
> = {
  ACCEPTED: {
    icon: CheckCircleIcon,
    color: "text-success",
  },
  WRONG_ANSWER: {
    icon: XCircleIcon,
    color: "text-error",
  },
  TIME_LIMIT_EXCEEDED: {
    icon: ClockIcon,
    color: "text-warning",
  },
  MEMORY_LIMIT_EXCEEDED: {
    icon: CpuIcon,
    color: "text-warning",
  },
  COMPILATION_ERROR: {
    icon: XCircleIcon,
    color: "text-error",
  },
  RUNTIME_ERROR: {
    icon: AlertTriangleIcon,
    color: "text-error",
  },
  QUEUED: {
    icon: Loader2Icon,
    color: "text-secondary",
  },
  RUNNING: {
    icon: Loader2Icon,
    color: "text-secondary",
  },
};

type ActionPayload = {
  code: string;
  language: Language;
};

type Action = {
  label: string;
  icon: Icon;
  onClick: (payload: ActionPayload) => void;
};

const LANGUAGE_MAP: Record<Language, string> = {
  CPP: "C++",
  JAVASCRIPT: "JavaScript",
};

function formatMemory(memoryInKb: number) {
  if (memoryInKb >= 1024) {
    const valueInMb = memoryInKb / 1024;
    return `${valueInMb >= 10 ? valueInMb.toFixed(0) : valueInMb.toFixed(1)} MB`;
  }
  return `${memoryInKb} KB`;
}

const highlighterPromise = createHighlighterCore({
  themes: [github_dark, github_light],
  langs: [cpp, javascript],
  engine: createJavaScriptRegexEngine(),
});

type SubmissionsTabProps = {
  problemId: string;
};

export function SubmissionsTab({ problemId }: SubmissionsTabProps) {
  const {
    data: submissions = [],
    error,
    isLoading,
    mutate,
  } = useSubmissions(problemId);

  const setCode = useSetAtom(codeAtom);
  const setLang = useSetAtom(languageAtom);

  const handleCopy = ({ code }: ActionPayload) => {
    navigator.clipboard.writeText(code);
    toast.success("Code copied to clipboard");
  };

  const handleLoadInEditor = ({ code, language }: ActionPayload) => {
    setCode(code);
    setLang(language);
    toast.success("Code loaded into editor");
  };

  const ACTIONS: Action[] = [
    { label: "Copy", icon: CopyIcon, onClick: handleCopy },
    { label: "Load in Editor", icon: ReplaceIcon, onClick: handleLoadInEditor },
  ];

  if (isLoading) {
    return (
      <div className="flex items-center justify-center py-12">
        <div className="flex items-center gap-2 text-xs text-secondary">
          <Loader2Icon size={13} className="animate-spin" />
          Loading submissions...
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex items-center justify-center py-12">
        <p className="text-xs text-secondary">Unable to load submissions.</p>
        <button
          onClick={() => mutate()}
          className="ml-2 text-xs text-primary hover:underline"
        >
          Retry
        </button>
      </div>
    );
  }

  return submissions.length === 0 ? (
    <div className="flex flex-col items-center justify-center py-20 gap-2 h-full">
      <CodeIcon size={20} className="text-disabled" strokeWidth={1.5} />
      <p className="text-sm text-secondary">No submissions yet.</p>
    </div>
  ) : (
    <Accordion className="rounded-none">
      {submissions.map((sub) => (
        <AccordionItem key={sub.id} value={sub.id}>
          <AccordionTrigger className="hover:no-underline justify-end! items-center min-w-fit gap-4">
            {(() => {
              const config = STATUS_CONFIG[sub.status] ?? STATUS_CONFIG.QUEUED;

              return (
                <div className={cn("flex items-center gap-2", config.color)}>
                  <config.icon
                    size={14}
                    strokeWidth={2}
                    className={
                      sub.status === "RUNNING" || sub.status === "QUEUED"
                        ? "animate-spin"
                        : ""
                    }
                  />
                  <span className="text-xs font-medium line-clamp-1 capitalize">
                    {sub.status.replaceAll("_", " ").toLowerCase()}
                  </span>
                </div>
              );
            })()}

            <Separator orientation="vertical" />

            <span className="text-xs text-secondary">
              {LANGUAGE_MAP[sub.language]}
            </span>

            <div className="flex items-center gap-3 text-xs text-secondary ml-auto line-clamp-1">
              {sub.timeInMs !== null && (
                <span className="tabular-nums truncate">{sub.timeInMs}ms</span>
              )}
              {sub.memoryInKb !== null && (
                <span className="tabular-nums truncate">
                  {formatMemory(sub.memoryInKb)}
                </span>
              )}
            </div>

            <span className="text-[11px] text-secondary tabular-nums line-clamp-1">
              {formatDistanceToNow(new Date(sub.createdAt), {
                addSuffix: true,
              })}
            </span>
          </AccordionTrigger>

          <AccordionContent className="border-t pt-3">
            <div className="flex items-center gap-2">
              <p className="font-mono-label">Code</p>
              {ACTIONS.map((action, idx) => (
                <Tooltip key={action.label}>
                  <TooltipTrigger
                    className={idx === 0 ? "ml-auto" : ""}
                    render={
                      <Button
                        key={action.label}
                        size="icon"
                        variant="outline"
                        onClick={(e) => {
                          e.stopPropagation();
                          action.onClick(sub);
                        }}
                      >
                        <action.icon className="size-3.5" />
                      </Button>
                    }
                  />
                  <TooltipContent>
                    <p>{action.label}</p>
                  </TooltipContent>
                </Tooltip>
              ))}
            </div>

            {(async () => {
              const highlightedCode = (await highlighterPromise).codeToHtml(
                sub.code,
                {
                  lang: sub.language.toLowerCase(),
                  themes: {
                    light: "github-light",
                    dark: "github-dark",
                  },
                },
              );

              return (
                <div
                  className="overflow-auto [&>pre]:bg-transparent! max-h-80 text-xs leading-snug font-mono [&>pre]:p-0!"
                  dangerouslySetInnerHTML={{ __html: highlightedCode }}
                />
              );
            })()}

            {sub.codeOutput && (
              <div className="flex flex-col gap-2">
                <p className="font-mono-label">Output</p>
                <pre className="rounded-md bg-muted/40 px-3 py-2 text-xs font-mono text-primary overflow-auto whitespace-pre-wrap">
                  {sub.codeOutput}
                </pre>
              </div>
            )}

            {sub.errorMessage && (
              <div className="flex flex-col gap-2">
                <p className="font-mono-label text-error">Error</p>
                <pre className="rounded-md bg-error/5 border border-error/20 px-3 py-2 text-xs font-mono text-error overflow-auto whitespace-pre-wrap">
                  {sub.errorMessage}
                </pre>
              </div>
            )}
          </AccordionContent>
        </AccordionItem>
      ))}
    </Accordion>
  );
}
