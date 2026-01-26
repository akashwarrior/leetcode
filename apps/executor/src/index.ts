import { redisService } from "@codearena/redis";
import { Language, prisma, SubmissionStatus } from "@codearena/db";

// TODO: make types as shared package
type Message = {
  id: string;
  message: {
    submissionId: string | null;
    executionId: string;
    problemId: string;
    language: Language;
    code: string;
    status: SubmissionStatus;
    createdAt: string;
  };
};

type GenericValue = number | string | boolean;

type TestCase = {
  input: Record<string, GenericValue | GenericValue[]>;
  expectedAnswer?: GenericValue | GenericValue[] | null;
  actualAnswer?: GenericValue | GenericValue[] | null;
  status?: "PASSED" | "FAILED";
  output?: string | null;
};

type Execution = {
  id: string;
  status: SubmissionStatus;
  attemptCount: number;
  passedTestCases: number;
  totalTestCases: number;
  testCases: TestCase[];
  memoryInKb?: number;
  timeInMs?: number;
  errorMessage: string | null;
};

const main = async () => {
  while (true) {
    const codeExecutions = await redisService.xRead("code-executions");
    const message = codeExecutions?.[0]?.messages[0] as Message | null;
    if (!message) {
      continue;
    }

    // -- execute code here --

    const payload: Execution = {
      id: message.message.executionId,
      status: "ACCEPTED",
      attemptCount: 1,
      passedTestCases: 5,
      totalTestCases: 5,
      testCases: [],
      errorMessage: null,
      memoryInKb: Math.floor(Math.random() * 1000),
      timeInMs: Math.floor(Math.random() * 1000),
    };

    // TODO: handle race update failures

    await redisService.set(
      `executions:${message.message.executionId}`,
      JSON.stringify(payload),
    );

    // if submissionId then update the submission in db

    if (message.message.submissionId) {
      await prisma.submission.update({
        where: {
          id: message.message.submissionId,
        },
        data: {
          status: "ACCEPTED",
          timeInMs:
            new Date().getTime() -
            new Date(message.message.createdAt).getTime(),
          memoryInKb: Math.floor(Math.random() * 1000),
        },
      });
    }
  }
};

main();
