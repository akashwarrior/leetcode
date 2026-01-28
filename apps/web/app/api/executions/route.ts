import { Execution } from "@/lib/types";
import { redisService } from "@codearena/redis";
import { type NextRequest, NextResponse } from "next/server";

export async function POST(req: NextRequest) {
  const { problemId, language, code } = await req.json();

  if (!problemId || !language || !code) {
    return NextResponse.json(
      { error: "Missing required fields" },
      { status: 400 },
    );
  }

  const id = crypto.randomUUID();

  const payload: Execution = {
    id,
    attemptCount: 1,
    errorMessage: null,
    passedTestCases: 0,
    status: "QUEUED",
    testCases: [],
    totalTestCases: 0,
  };

  try {
    await redisService.set(`executions:${id}`, JSON.stringify(payload), {
      expiration: {
        type: "EX",
        value: 30, // 30 seconds
      },
    });

    await redisService.xAdd("code-executions", {
      id,
      code,
      language,
      problemId,
    });

    return NextResponse.json({ id });
  } catch (error) {
    console.error("Error queuing execution:", error);
    return NextResponse.json(
      { error: "Failed to execute code" },
      { status: 500 },
    );
  }
}
