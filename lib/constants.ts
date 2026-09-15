import type { Element } from "@/lib/saju/types";

export const ELEMENT_COLORS: Record<Element, string> = {
  wood: "bg-emerald-500",
  fire: "bg-red-500",
  earth: "bg-amber-600",
  metal: "bg-slate-300",
  water: "bg-blue-500",
};

export const ELEMENT_LABELS_KO: Record<Element, string> = {
  wood: "木 (목)",
  fire: "火 (화)",
  earth: "土 (토)",
  metal: "金 (금)",
  water: "水 (수)",
};

export const TOPIC_LABELS = {
  basic: "기본 사주",
  love: "연애 상담",
  career: "성공운 상담",
} as const;

export const COUNSELOR_LABELS = {
  cold: "냉철한 상담가",
  warm: "공감형 상담가",
} as const;

export const COUNSELOR_PROFILES = {
  cold: {
    title: COUNSELOR_LABELS.cold,
    image: "/images/counselors/cold.png",
    quote: "듣기 좋은 말보다, 필요한 말을 드립니다.",
    description:
      "사주 명식과 현재 상황을 감정 없이 분석합니다. '위로'보다 '사실'과 '현실적인 선택지'를 직설적으로 전달하며, 지금 당장 무엇을 해야 할지 판단이 필요할 때 적합합니다.",
    keywords: "FACT · LOGIC · DIRECT",
  },
  warm: {
    title: COUNSELOR_LABELS.warm,
    image: "/images/counselors/warm.png",
    quote: "답을 찾기 전에, 당신의 마음부터 들어볼게요.",
    description:
      "먼저 감정과 고민을 충분히 공감한 뒤, 사주 해석을 부드럽게 풀어 설명합니다. 마음이 무거울 때, 혼자 감당하기 어려운 이야기를 나누고 싶을 때 적합합니다.",
    keywords: "EMPATHY · WARM · SUPPORT",
  },
} as const;

export const APPROXIMATE_TIME_SLOTS = [
  {
    id: "unknown",
    label: "— 시간대 모름 (시주 비움) —",
    timeUnknown: true as const,
  },
  {
    id: "dawn",
    label: "새벽 (03–06시)",
    hour: 4,
    minute: 30,
  },
  {
    id: "morning",
    label: "아침 (06–12시)",
    hour: 9,
    minute: 0,
  },
  {
    id: "afternoon",
    label: "오후 (12–18시)",
    hour: 15,
    minute: 0,
  },
  {
    id: "evening",
    label: "저녁 (18–22시)",
    hour: 20,
    minute: 0,
  },
  {
    id: "night",
    label: "밤 (22–03시)",
    hour: 0,
    minute: 30,
  },
] as const;

export type ApproximateTimeSlotId =
  (typeof APPROXIMATE_TIME_SLOTS)[number]["id"];

export const RECOMMENDED_QUESTIONS = {
  basic: [
    "제 사주의 핵심 성향은 무엇인가요?",
    "강점과 약점을 알려주세요.",
    "올해 운의 흐름은 어떤가요?",
    "인간관계에서 주의할 점은?",
  ],
  love: [
    "올해 연애운은 어떤가요?",
    "나는 어떤 사람과 잘 맞나요?",
    "좋은 인연은 언제 들어오나요?",
    "먼저 연락해도 될까요?",
  ],
  career: [
    "나는 어떤 직업이 잘 맞나요?",
    "회사 생활이 잘 맞는 사주인가요?",
    "커리어를 바꾸기 좋은 시기는?",
    "올해 이직해도 괜찮을까요?",
  ],
} as const;
