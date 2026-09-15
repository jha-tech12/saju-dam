import type { EightChar } from "./eight-char";
import {
  CLASH_PAIRS,
  COMBINE_PAIRS,
  ELEMENT_GENERATES,
  ELEMENT_OVERCOMES,
  HARM_PAIRS,
  HIDDEN_STEMS,
  PUNISH_GROUPS,
  BREAK_PAIRS,
  STEM_ELEMENT,
} from "./constants";
import type {
  Element,
  HiddenStemEntry,
  Pillar,
  RelationEntry,
  StrengthLevel,
  TenGodEntry,
} from "./types";

const POSITIONS = ["year", "month", "day", "hour"] as const;

function hasPair(a: string, b: string, pairs: [string, string][]): boolean {
  return pairs.some(
    ([x, y]) => (x === a && y === b) || (x === b && y === a),
  );
}

function countElement(values: Element[]): Record<Element, number> {
  return values.reduce(
    (acc, element) => {
      acc[element] += 1;
      return acc;
    },
    { wood: 0, fire: 0, earth: 0, metal: 0, water: 0 },
  );
}

export function calculateFiveElements(
  pillars: { year: Pillar; month: Pillar; day: Pillar; hour: Pillar | null },
): Record<Element, number> {
  const elements: Element[] = [
    pillars.year.stemElement,
    pillars.year.branchElement,
    pillars.month.stemElement,
    pillars.month.branchElement,
    pillars.day.stemElement,
    pillars.day.branchElement,
  ];

  if (pillars.hour) {
    elements.push(pillars.hour.stemElement, pillars.hour.branchElement);
  }

  for (const pillar of Object.values(pillars)) {
    if (!pillar) continue;
    for (const stem of HIDDEN_STEMS[pillar.branch] ?? []) {
      elements.push(STEM_ELEMENT[stem]);
    }
  }

  return countElement(elements);
}

export function extractTenGods(
  eightChar: EightChar,
  timeUnknown: boolean,
): { stems: TenGodEntry[]; branches: TenGodEntry[] } {
  const stemMap: Record<(typeof POSITIONS)[number], string> = {
    year: eightChar.getYearShiShenGan(),
    month: eightChar.getMonthShiShenGan(),
    day: eightChar.getDayShiShenGan(),
    hour: eightChar.getTimeShiShenGan(),
  };

  const branchMap: Record<(typeof POSITIONS)[number], string[]> = {
    year: eightChar.getYearShiShenZhi(),
    month: eightChar.getMonthShiShenZhi(),
    day: eightChar.getDayShiShenZhi(),
    hour: eightChar.getTimeShiShenZhi(),
  };

  const positions = timeUnknown
    ? (["year", "month", "day"] as const)
    : POSITIONS;

  return {
    stems: positions.map((position) => ({
      position,
      stem:
        position === "year"
          ? eightChar.getYearGan()
          : position === "month"
            ? eightChar.getMonthGan()
            : position === "day"
              ? eightChar.getDayGan()
              : eightChar.getTimeGan(),
      tenGod: stemMap[position],
    })),
    branches: positions.flatMap((position) =>
      branchMap[position].map((tenGod, index) => ({
        position: `${position}지${index + 1}`,
        tenGod,
      })),
    ),
  };
}

export function extractHiddenStems(
  pillars: { year: Pillar; month: Pillar; day: Pillar; hour: Pillar | null },
  eightChar: EightChar,
  timeUnknown: boolean,
): HiddenStemEntry[] {
  const branchSources = timeUnknown
    ? [
        { position: "year", branch: pillars.year.branch, zhiFn: () => eightChar.getYearShiShenZhi() },
        { position: "month", branch: pillars.month.branch, zhiFn: () => eightChar.getMonthShiShenZhi() },
        { position: "day", branch: pillars.day.branch, zhiFn: () => eightChar.getDayShiShenZhi() },
      ]
    : [
        { position: "year", branch: pillars.year.branch, zhiFn: () => eightChar.getYearShiShenZhi() },
        { position: "month", branch: pillars.month.branch, zhiFn: () => eightChar.getMonthShiShenZhi() },
        { position: "day", branch: pillars.day.branch, zhiFn: () => eightChar.getDayShiShenZhi() },
        { position: "hour", branch: pillars.hour!.branch, zhiFn: () => eightChar.getTimeShiShenZhi() },
      ];

  return branchSources.map(({ position, branch, zhiFn }) => ({
    branch,
    position,
    stems: HIDDEN_STEMS[branch] ?? [],
    tenGods: zhiFn(),
  }));
}

export function calculateRelations(
  pillars: { year: Pillar; month: Pillar; day: Pillar; hour: Pillar | null },
): RelationEntry[] {
  const entries: RelationEntry[] = [];
  const positions = [
    { label: "년지", branch: pillars.year.branch },
    { label: "월지", branch: pillars.month.branch },
    { label: "일지", branch: pillars.day.branch },
    ...(pillars.hour ? [{ label: "시지", branch: pillars.hour.branch }] : []),
  ];

  for (let i = 0; i < positions.length; i += 1) {
    for (let j = i + 1; j < positions.length; j += 1) {
      const a = positions[i];
      const b = positions[j];

      if (hasPair(a.branch, b.branch, CLASH_PAIRS)) {
        entries.push({
          type: "충",
          source: a.label,
          target: b.label,
          description: `${a.branch}${b.branch} 충`,
        });
      }
      if (hasPair(a.branch, b.branch, COMBINE_PAIRS)) {
        entries.push({
          type: "합",
          source: a.label,
          target: b.label,
          description: `${a.branch}${b.branch} 합`,
        });
      }
      if (hasPair(a.branch, b.branch, HARM_PAIRS)) {
        entries.push({
          type: "해",
          source: a.label,
          target: b.label,
          description: `${a.branch}${b.branch} 해`,
        });
      }
      if (hasPair(a.branch, b.branch, BREAK_PAIRS)) {
        entries.push({
          type: "파",
          source: a.label,
          target: b.label,
          description: `${a.branch}${b.branch} 파`,
        });
      }
    }
  }

  for (const group of PUNISH_GROUPS) {
    const matched = positions.filter((item) => group.includes(item.branch));
    if (matched.length >= 2) {
      entries.push({
        type: "형",
        source: matched[0].label,
        target: matched[1].label,
        description: `${matched.map((item) => item.branch).join("")} 형`,
      });
    }
  }

  return entries;
}

function getSeasonSupport(dayElement: Element, monthBranch: string): number {
  const seasonMap: Record<string, Element[]> = {
    寅: ["wood", "fire"],
    卯: ["wood"],
    辰: ["earth", "wood"],
    巳: ["fire"],
    午: ["fire"],
    未: ["earth", "fire"],
    申: ["metal"],
    酉: ["metal"],
    戌: ["earth", "metal"],
    亥: ["water", "wood"],
    子: ["water"],
    丑: ["earth", "water"],
  };

  const seasonElements = seasonMap[monthBranch] ?? [];
  if (seasonElements.includes(dayElement)) return 2;
  if (seasonElements.includes(ELEMENT_GENERATES[dayElement])) return 1;
  if (seasonElements.includes(ELEMENT_OVERCOMES[dayElement])) return -2;
  return 0;
}

export function calculateStrength(
  dayElement: Element,
  monthBranch: string,
  fiveElements: Record<Element, number>,
): {
  level: StrengthLevel;
  label: string;
  supportElements: Element[];
  candidateYongsin: Element[];
} {
  const supportElements = [
    dayElement,
    Object.entries(ELEMENT_GENERATES).find(([, v]) => v === dayElement)?.[0] as Element,
  ].filter(Boolean);

  const drainElements = [
    ELEMENT_GENERATES[dayElement],
    ELEMENT_OVERCOMES[dayElement],
    Object.entries(ELEMENT_OVERCOMES).find(([, v]) => v === dayElement)?.[0] as Element,
  ].filter(Boolean);

  let score = getSeasonSupport(dayElement, monthBranch);
  for (const element of supportElements) {
    score += fiveElements[element] * 0.5;
  }
  for (const element of drainElements) {
    score -= fiveElements[element] * 0.5;
  }

  let level: StrengthLevel = "balanced";
  let label = "중화";
  if (score >= 2) {
    level = "strong";
    label = "신강";
  } else if (score <= -1) {
    level = "weak";
    label = "신약";
  }

  const candidateYongsin =
    level === "strong"
      ? [ELEMENT_OVERCOMES[dayElement], ELEMENT_GENERATES[dayElement]]
      : level === "weak"
        ? supportElements
        : [dayElement, ELEMENT_GENERATES[dayElement]];

  return {
    level,
    label,
    supportElements,
    candidateYongsin: [...new Set(candidateYongsin)],
  };
}
