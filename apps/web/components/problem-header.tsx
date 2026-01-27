"use client";

import type { Language } from "@codearena/db";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { useAtom } from "jotai";
import { useExecution } from "@/hooks/use-execution";
import { languageAtom } from "@/lib/store";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  ArrowLeftIcon,
  CaretRightIcon,
  CodeBlockIcon,
  PaperPlaneTiltIcon,
  PlayIcon,
  SpinnerIcon,
} from "@phosphor-icons/react";

const LANGUAGES: Language[] = ["CPP", "JAVASCRIPT"];

type ProblemHeaderProps = {
  title: string;
  problemId: string;
};

export function ProblemHeader({ title, problemId }: ProblemHeaderProps) {
  const router = useRouter();
  const [language, setLanguage] = useAtom(languageAtom);

  const { isExecuting, isSubmitting, runCode, submitCode } = useExecution({
    problemId,
  });

  return (
    <header className="sticky top-0 z-50 border-b border-border bg-card flex py-1.5 items-center justify-between gap-3 px-4 flex-wrap">
      <div className="flex items-center gap-2">
        <Link href="/" prefetch={false} className="flex items-center gap-2">
          <div className="flex size-5 items-center justify-center rounded bg-primary">
            <CodeBlockIcon
              size={10}
              className="text-primary-foreground"
              weight="bold"
            />
          </div>
          <span className="hidden sm:block text-sm font-medium tracking-tight text-primary">
            CodeArena
          </span>
        </Link>

        <span className="text-sm text-disabled">/</span>

        <Button
          variant="link"
          onClick={router.back}
          className="group flex items-center gap-1.5 px-0 text-xs text-secondary hover:text-primary hover:no-underline"
        >
          <ArrowLeftIcon
            size={12}
            className="transition-all group-hover:-translate-x-0.5"
          />
          Problems
        </Button>

        <CaretRightIcon size={12} className="text-disabled" />

        <span className="max-w-40 truncate text-xs font-medium text-primary">
          {title}
        </span>
      </div>

      <div className="flex items-center gap-2">
        <Select
          value={language}
          onValueChange={(v) => setLanguage(v as typeof language)}
        >
          <SelectTrigger size="sm" className="rounded-md text-xs w-30">
            <SelectValue />
          </SelectTrigger>
          <SelectContent className="rounded-md">
            {LANGUAGES.map((language) => (
              <SelectItem
                key={language}
                value={language}
                className="rounded-md text-xs"
              >
                {language}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>

        <Button
          size="sm"
          variant="outline"
          className="gap-1.5 rounded-md text-xs"
          disabled={isExecuting || isSubmitting}
          onClick={runCode}
        >
          {isExecuting ? (
            <SpinnerIcon size={12} className="animate-spin" />
          ) : (
            <PlayIcon size={12} />
          )}
          Run
        </Button>

        <Button
          size="sm"
          className="gap-1.5 rounded-md text-xs"
          disabled={isSubmitting || isExecuting}
          onClick={submitCode}
        >
          {isSubmitting ? (
            <SpinnerIcon size={12} className="animate-spin" />
          ) : (
            <PaperPlaneTiltIcon size={12} />
          )}
          Submit
        </Button>
      </div>
    </header>
  );
}
