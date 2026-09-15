import { streamText } from "ai";
import { openai } from "@ai-sdk/openai";
import { z } from "zod";
import { buildSystemPrompt } from "@/lib/ai/prompts";
import type { SajuResult } from "@/lib/saju/types";

const requestSchema = z.object({
  saju: z.custom<SajuResult>(),
  counselor: z.enum(["cold", "warm"]),
  topic: z.enum(["basic", "love", "career"]),
  messages: z.array(
    z.object({
      role: z.enum(["user", "assistant"]),
      content: z.string(),
    }),
  ),
});

export async function POST(request: Request) {
  try {
    const body = requestSchema.parse(await request.json());

    if (!process.env.OPENAI_API_KEY) {
      return new Response(
        JSON.stringify({
          error:
            "OPENAI_API_KEY가 설정되지 않았습니다. .env.local 파일을 확인해주세요.",
        }),
        { status: 500, headers: { "Content-Type": "application/json" } },
      );
    }

    const result = streamText({
      model: openai("gpt-4o-mini"),
      system: buildSystemPrompt(body.saju, body.counselor, body.topic),
      messages: body.messages,
    });

    return result.toDataStreamResponse();
  } catch (error) {
    const message =
      error instanceof Error ? error.message : "상담 요청 처리 중 오류";
    return new Response(JSON.stringify({ error: message }), {
      status: 400,
      headers: { "Content-Type": "application/json" },
    });
  }
}
