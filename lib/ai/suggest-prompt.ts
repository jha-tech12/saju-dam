import { TOPIC_LABELS } from "@/lib/constants";
import type { TopicType } from "@/lib/ai/personas";
import type { SajuResult } from "@/lib/saju/types";

type ChatMessage = { role: "user" | "assistant"; content: string };

export function buildSuggestQuestionsPrompt(
  saju: SajuResult,
  topic: TopicType,
  messages: ChatMessage[],
  askedQuestions: string[],
): string {
  const recent = messages.slice(-8);

  return `당신은 AI 사주 상담 서비스의 후속 질문 추천 도우미입니다.

## 상담 주제
${TOPIC_LABELS[topic]}

## 사용자 이름
${saju.birth.name}

## 최근 대화
${recent.map((m) => `${m.role === "user" ? "사용자" : "상담가"}: ${m.content}`).join("\n\n")}

## 이미 물어본 질문 (제외)
${askedQuestions.length > 0 ? askedQuestions.map((q) => `- ${q}`).join("\n") : "없음"}

위 대화 맥락을 바탕으로, 사용자가 이어서 궁금해할 만한 질문 4개를 추천하세요.

규칙:
- 최근 상담 내용과 직접 연관된 질문
- 15~35자 내외의 자연스러운 한국어
- 이미 물어본 질문과 중복 금지
- JSON만 응답: {"questions":["질문1","질문2","질문3","질문4"]}`;
}
