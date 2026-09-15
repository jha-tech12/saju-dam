import { generateText } from "ai";
import { openai } from "@ai-sdk/openai";
import { NextResponse } from "next/server";
import { z } from "zod";
import { buildAnalysisPrompt } from "@/lib/ai/prompts";
import type { SajuResult } from "@/lib/saju/types";

const requestSchema = z.object({
  saju: z.custom<SajuResult>(),
});

const ELEMENT_KO: Record<string, string> = {
  wood: "목",
  fire: "화",
  earth: "토",
  metal: "금",
  water: "수",
};

function fallbackCards(saju: SajuResult) {
  const supportKo = saju.strength.supportElements
    .map((element) => ELEMENT_KO[element])
    .join(", ");

  return {
    cards: [
      {
        title: "강점",
        content: `일간 ${saju.dayMaster.stem}(${saju.strength.label})을 중심으로, ${supportKo} 기운이 도움이 되는 상황에서 집중력과 추진력을 발휘할 수 있습니다.`,
      },
      {
        title: "약점",
        content: `오행이 한쪽으로 치우치거나 ${saju.strength.label === "신강" ? "에너지가 과할" : "기운이 부족할"} 때 스트레스를 받기 쉬울 수 있습니다. 균형 있는 리듬이 중요합니다.`,
      },
      {
        title: "관계",
        content: `일지 ${saju.pillars.day.branch}와 십신 구조를 보면, 관계에서 ${saju.relations.length > 0 ? "합·충 등 역동적인 패턴" : "비교적 안정적인 패턴"}이 나타날 수 있습니다.`,
      },
    ],
  };
}

export async function POST(request: Request) {
  try {
    const body = requestSchema.parse(await request.json());

    if (!process.env.OPENAI_API_KEY) {
      return NextResponse.json(fallbackCards(body.saju));
    }

    const { text } = await generateText({
      model: openai("gpt-4o-mini"),
      prompt: buildAnalysisPrompt(body.saju),
    });

    const jsonMatch = text.match(/\{[\s\S]*\}/);
    if (jsonMatch) {
      const parsed = JSON.parse(jsonMatch[0]);
      return NextResponse.json(parsed);
    }

    return NextResponse.json(fallbackCards(body.saju));
  } catch {
    return NextResponse.json(
      { error: "분석 생성에 실패했습니다." },
      { status: 500 },
    );
  }
}
