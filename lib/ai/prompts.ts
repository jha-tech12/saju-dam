import type { SajuResult } from "@/lib/saju/types";
import { PERSONAS, SYSTEM_RULES, type CounselorType, type TopicType } from "./personas";
import { retrieveKnowledge } from "./knowledge";

export function buildSystemPrompt(
  saju: SajuResult,
  counselor: CounselorType,
  topic: TopicType,
): string {
  const knowledge = retrieveKnowledge(saju, topic);

  return `${PERSONAS[counselor]}

${SYSTEM_RULES}

## 상담 주제
${topic}

## SAJU JSON
${JSON.stringify(saju, null, 2)}

## 명리학 지식 DB
${knowledge}

위 명식과 지식을 바탕으로 상담하세요. 한국어로 답변하세요.`;
}

export function buildAnalysisPrompt(saju: SajuResult): string {
  const knowledge = retrieveKnowledge(saju, "basic");

  return `다음 사주 명식을 바탕으로 '강점', '약점', '관계' 3가지 성향 카드를 작성하세요.

규칙:
- 명식 JSON의 값만 사용
- 각 카드는 2-3문장
- JSON 형식으로만 응답: {"cards":[{"title":"강점","content":"..."},{"title":"약점","content":"..."},{"title":"관계","content":"..."}]}

## SAJU JSON
${JSON.stringify(saju, null, 2)}

## 명리학 지식
${knowledge}`;
}
