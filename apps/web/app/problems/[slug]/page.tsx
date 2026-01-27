import type { Difficulty, Problem } from "@codearena/db";
import type { TestCase } from "@/lib/types";
import { Provider } from "jotai";
import { notFound } from "next/navigation";
import { prisma } from "@codearena/db";
import { Badge } from "@/components/ui/badge";
import { SubmissionsTab } from "@/components/submissions";
import { Testcases } from "@/components/testcases";
import { Execution } from "@/components/execution";
import { CodeEditor } from "@/components/code-editor";
import { ProblemHeader } from "@/components/problem-header";

import Markdown from "react-markdown";
import remarkMath from "remark-math";
import remarkGfm from "remark-gfm";
import rehypeKatex from "rehype-katex";
import rehypeRaw from "rehype-raw";
// @ts-ignore editor is dumb
import "katex/dist/katex.min.css";

import {
  Tabs,
  TabsContent,
  TabsList,
  TabsTrigger,
  tabsListVariants,
} from "@/components/ui/tabs";
import {
  ResizableHandle,
  ResizablePanel,
  ResizablePanelGroup,
} from "@/components/ui/resizable";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import {
  BookOpenIcon,
  ClockCounterClockwiseIcon,
  CodeBlockIcon,
  LightbulbIcon,
  ListChecksIcon,
  PulseIcon,
} from "@phosphor-icons/react/ssr";

function difficultyStyle(d: Difficulty) {
  if (d === "EASY") return "status-success";
  if (d === "MEDIUM") return "status-warning";
  return "status-error";
}

function ProblemDescription({
  problem,
  description,
}: {
  problem: Omit<Problem, "slug" | "createdAt" | "updatedAt"> & {
    tags: Array<{ id: string; name: string }>;
  };
  description: string;
}) {
  return (
    <div className="flex flex-col gap-5 p-5 overflow-x-hidden">
      <div className="flex flex-col gap-2">
        <div className="flex items-start justify-between gap-3">
          <h1 className="text-base font-medium leading-snug text-primary">
            {problem.title}
          </h1>
          <Badge
            variant="outline"
            className={difficultyStyle(problem.difficulty)}
          >
            {problem.difficulty.toLowerCase()}
          </Badge>
        </div>

        <div className="flex flex-wrap items-center gap-3 text-xs text-secondary">
          <span>
            Acceptance:{" "}
            <span className="font-medium text-primary">
              {(
                (problem.totalAccepted / problem.totalSubmissions) *
                100
              ).toFixed(2)}
              %
            </span>
          </span>
          <span>
            Submissions:{" "}
            <span className="font-medium font-mono tabular-nums text-primary">
              {problem.totalSubmissions}
            </span>
          </span>
        </div>
      </div>

      {problem.tags.length > 0 && (
        <div className="flex flex-wrap gap-1.5">
          {problem.tags.map((tag) => (
            <Badge key={tag.id} variant="secondary">
              {tag.name}
            </Badge>
          ))}
        </div>
      )}

      <Markdown
        remarkPlugins={[remarkMath, remarkGfm]}
        rehypePlugins={[rehypeRaw, rehypeKatex]}
      >
        {description}
      </Markdown>

      <div className="rounded-lg border border-border bg-muted/40 p-4 text-xs">
        <p className="mb-2 font-mono-label">CONSTRAINTS</p>
        <div className="flex flex-col gap-1.5">
          <p className="font-mono text-secondary">
            Time limit: {problem.timeLimitMs}ms
          </p>
          <p className="font-mono text-secondary">
            Memory limit: {problem.memoryLimitKb / 1000}MB
          </p>
        </div>
      </div>
    </div>
  );
}

function ProblemHints({ hints }: { hints: string[] }) {
  return (
    <div className="flex flex-col gap-3 p-4 sm:p-5">
      {hints.length === 0 && (
        <p className="text-sm text-secondary">No hints available.</p>
      )}

      <Accordion multiple className="rounded-none gap-2 border-none">
        {hints.map((hint, idx) => (
          <AccordionItem
            key={hint}
            value={hint}
            className="rounded-lg bg-muted/40"
          >
            <AccordionTrigger>
              <p className="flex justify-center gap-2">
                <LightbulbIcon size={14} className="status-warning" />
                Hint {idx + 1}
              </p>
            </AccordionTrigger>
            <AccordionContent className="border-t border-t-border px-2 py-3 text-sm text-secondary">
              {hint}
            </AccordionContent>
          </AccordionItem>
        ))}
      </Accordion>
    </div>
  );
}

export default async function ProblemPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const baseURL = process.env.PROBLEM_BASE_URL;
  if (!baseURL) {
    throw new Error("PROBLEM_BASE_URL environment variable is not defined");
  }

  const { slug } = await params;

  const [problem, description, templateSnippet, ...testCases] =
    await Promise.all([
      prisma.problem.findUnique({
        where: { slug },
        include: {
          tags: true,
        },
        omit: {
          slug: true,
          createdAt: true,
          updatedAt: true,
        },
      }),
      fetch(`${baseURL}/description.md`).then((res) => res.text()),
      fetch(`${baseURL}/templates/template.js`).then((res) => res.text()),
      ...[1, 2, 3, 4, 5].map((tc) =>
        fetch(`${baseURL}/testcases/${tc}.json`).then(
          (res) => res.json() as Promise<TestCase>,
        ),
      ),
    ]);

  if (!problem || problem.isHidden) {
    notFound();
  }

  return (
    <Provider>
      <div className="flex h-screen w-full flex-col overflow-hidden bg-background">
        <ProblemHeader title={problem.title} problemId={problem.id} />

        <ResizablePanelGroup
          orientation="horizontal"
          className="hidden! md:flex!"
        >
          <ResizablePanel defaultSize="45%">
            <Tabs defaultValue="description" className="h-full">
              <TabsList variant="line" className="mt-1 w-full">
                {[
                  {
                    id: "description",
                    icon: BookOpenIcon,
                    label: "Description",
                  },
                  {
                    id: "submissions",
                    icon: ClockCounterClockwiseIcon,
                    label: "Submissions",
                  },
                  { id: "hints", icon: LightbulbIcon, label: "Hints" },
                ].map(({ id, icon: Icon, label }) => (
                  <TabsTrigger key={id} value={id} className="text-xs">
                    <Icon size={13} />
                    {label}
                  </TabsTrigger>
                ))}
              </TabsList>

              <TabsContent value="description">
                <ProblemDescription
                  problem={problem}
                  description={description}
                />
              </TabsContent>

              <TabsContent value="submissions">
                <SubmissionsTab problemId={problem.id} />
              </TabsContent>

              <TabsContent value="hints">
                <ProblemHints hints={problem.hints} />
              </TabsContent>
            </Tabs>
          </ResizablePanel>

          <ResizableHandle withHandle />

          <ResizablePanel>
            <ResizablePanelGroup orientation="vertical">
              <ResizablePanel defaultSize="60%">
                <CodeEditor initialCode={templateSnippet} />
              </ResizablePanel>

              <ResizableHandle withHandle />

              <ResizablePanel>
                <Tabs defaultValue="testcase" className="h-full">
                  <div className="border-b border-border bg-card">
                    <TabsList variant="line" className="mt-1 px-2">
                      {[
                        { id: "testcase", label: "Test Cases" },
                        { id: "result", label: "Result" },
                      ].map(({ id, label }) => (
                        <TabsTrigger
                          key={id}
                          value={id}
                          className="text-xs w-24"
                        >
                          {label}
                        </TabsTrigger>
                      ))}
                    </TabsList>
                  </div>

                  <TabsContent value="testcase">
                    <Testcases
                      testCases={testCases.map(({ input }) => ({ input }))}
                    />
                  </TabsContent>

                  <TabsContent value="result">
                    <Execution />
                  </TabsContent>
                </Tabs>
              </ResizablePanel>
            </ResizablePanelGroup>
          </ResizablePanel>
        </ResizablePanelGroup>

        <Tabs
          defaultValue="description"
          className="flex-1 md:hidden max-w-full min-w-full w-full!"
        >
          <div className="w-full overflow-hidden overflow-x-auto">
            <TabsList variant="line">
              {[
                { id: "description", icon: BookOpenIcon, label: "Description" },
                { id: "editor", icon: CodeBlockIcon, label: "Code" },
                { id: "cases", icon: ListChecksIcon, label: "Cases" },
                { id: "result", icon: PulseIcon, label: "Result" },
                {
                  id: "submissions",
                  icon: ClockCounterClockwiseIcon,
                  label: "Submissions",
                },
                { id: "hints", icon: LightbulbIcon, label: "Hints" },
              ].map(({ id, icon: Icon, label }) => (
                <TabsTrigger key={id} value={id} className="text-xs">
                  <Icon size={13} />
                  {label}
                </TabsTrigger>
              ))}
            </TabsList>
          </div>

          <TabsContent value="description">
            <ProblemDescription problem={problem} description={description} />
          </TabsContent>

          <TabsContent value="editor">
            <CodeEditor initialCode={templateSnippet} />
          </TabsContent>

          <TabsContent value="cases">
            <Testcases testCases={testCases.map(({ input }) => ({ input }))} />
          </TabsContent>

          <TabsContent value="result">
            <Execution />
          </TabsContent>

          <TabsContent value="submissions">
            <SubmissionsTab problemId={problem.id} />
          </TabsContent>

          <TabsContent value="hints">
            <ProblemHints hints={problem.hints} />
          </TabsContent>
        </Tabs>
      </div>
    </Provider>
  );
}
