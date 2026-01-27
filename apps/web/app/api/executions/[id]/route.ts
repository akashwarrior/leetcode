import { redisService } from "@codearena/redis";
import { NextRequest, NextResponse } from "next/server";

type Params = {
  id: string;
};

export async function GET(
  _req: NextRequest,
  { params }: { params: Promise<Params> },
) {
  const { id } = await params;

  const execution = await redisService.get(`executions:${id}`);

  if (!execution) {
    return NextResponse.json({
      error: "Execution not found",
    }, {
      status: 404,
    });
  }

  return NextResponse.json(JSON.parse(execution));
}
