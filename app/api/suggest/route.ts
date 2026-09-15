import { generateText } from "ai";
import { openai } from "@ai-sdk/openai";
import { NextResponse } from "next/server";
import { z } from "zod";
import { buildSuggestQuestionsPrompt } from "@/lib/ai/suggest-prompt";
import { RECOMMENDED_QUESTIONS } from "@/lib/constants";
import type { SajuResult } from "@/lib/saju/types";

const requestSchema = z.object({
  saju: z.custom<SajuResult>(),
  topic: z.enum(["basic", "love", "career"]),
  messages: z.array(
    z.object({
      role: z.enum(["user", "assistant"]),
      content: z.string(),
    }),
  ),
  askedQuestions: z.array(z.string()).optional(),
});

export async function POST(request: Request) {
  try {
    const body = requestSchema.parse(await request.json());
    const asked = body.askedQuestions ?? [];
    const fallback = RECOMMENDED_QUESTIONS[body.topic].filter(
      (q) => !asked.includes(q),
    );

    if (!process.env.OPENAI_API_KEY) {
      return NextResponse.json({ questions: fallback.slice(0, 4) });
    }

    const { text } = await generateText({
      model: openai("gpt-4o-mini"),
      prompt: buildSuggestQuestionsPrompt(
        body.saju,
        body.topic,
        body.messages,
        asked,
      ),
    });

    const jsonMatch = text.match(/\{[\s\S]*\}/);
    if (jsonMatch) {
      const parsed = JSON.parse(jsonMatch[0]) as { questions?: string[] };
      const questions = (parsed.questions ?? [])
        .filter((q) => q && !asked.includes(q))
        .slice(0, 4);
      if (questions.length > 0) {
        return NextResponse.json({ questions });
      }
    }

    return NextResponse.json({ questions: fallback.slice(0, 4) });
  } catch {
    return NextResponse.json({ questions: [] }, { status: 500 });
  }
}
