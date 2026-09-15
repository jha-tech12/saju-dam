import type { Element, YinYang } from "./types";

export const HEAVENLY_STEMS = [
  "甲", "乙", "丙", "丁", "戊", "己", "庚", "辛", "壬", "癸",
] as const;

export const EARTHLY_BRANCHES = [
  "子", "丑", "寅", "卯", "辰", "巳", "午", "未", "申", "酉", "戌", "亥",
] as const;

export const STEM_ELEMENT: Record<string, Element> = {
  甲: "wood",
  乙: "wood",
  丙: "fire",
  丁: "fire",
  戊: "earth",
  己: "earth",
  庚: "metal",
  辛: "metal",
  壬: "water",
  癸: "water",
};

export const BRANCH_ELEMENT: Record<string, Element> = {
  子: "water",
  丑: "earth",
  寅: "wood",
  卯: "wood",
  辰: "earth",
  巳: "fire",
  午: "fire",
  未: "earth",
  申: "metal",
  酉: "metal",
  戌: "earth",
  亥: "water",
};

export const STEM_YIN_YANG: Record<string, YinYang> = {
  甲: "yang",
  乙: "yin",
  丙: "yang",
  丁: "yin",
  戊: "yang",
  己: "yin",
  庚: "yang",
  辛: "yin",
  壬: "yang",
  癸: "yin",
};

export const HIDDEN_STEMS: Record<string, string[]> = {
  子: ["癸"],
  丑: ["己", "癸", "辛"],
  寅: ["甲", "丙", "戊"],
  卯: ["乙"],
  辰: ["戊", "乙", "癸"],
  巳: ["丙", "戊", "庚"],
  午: ["丁", "己"],
  未: ["己", "丁", "乙"],
  申: ["庚", "壬", "戊"],
  酉: ["辛"],
  戌: ["戊", "辛", "丁"],
  亥: ["壬", "甲"],
};

export const ELEMENT_LABELS: Record<Element, string> = {
  wood: "木",
  fire: "火",
  earth: "土",
  metal: "金",
  water: "水",
};

export const ELEMENT_GENERATES: Record<Element, Element> = {
  wood: "fire",
  fire: "earth",
  earth: "metal",
  metal: "water",
  water: "wood",
};

export const ELEMENT_OVERCOMES: Record<Element, Element> = {
  wood: "earth",
  earth: "water",
  water: "fire",
  fire: "metal",
  metal: "wood",
};

export const CLASH_PAIRS: [string, string][] = [
  ["子", "午"],
  ["丑", "未"],
  ["寅", "申"],
  ["卯", "酉"],
  ["辰", "戌"],
  ["巳", "亥"],
];

export const COMBINE_PAIRS: [string, string][] = [
  ["子", "丑"],
  ["寅", "亥"],
  ["卯", "戌"],
  ["辰", "酉"],
  ["巳", "申"],
  ["午", "未"],
];

export const HARM_PAIRS: [string, string][] = [
  ["子", "未"],
  ["丑", "午"],
  ["寅", "巳"],
  ["卯", "辰"],
  ["申", "亥"],
  ["酉", "戌"],
];

export const PUNISH_GROUPS: string[][] = [
  ["寅", "巳", "申"],
  ["丑", "戌", "未"],
  ["子", "卯"],
];

export const BREAK_PAIRS: [string, string][] = [
  ["子", "酉"],
  ["卯", "午"],
  ["辰", "丑"],
  ["未", "戌"],
  ["寅", "亥"],
  ["巳", "申"],
];

export const POSITION_LABELS = {
  year: "년",
  month: "월",
  day: "일",
  hour: "시",
} as const;

export const CALCULATION_POLICY = {
  yearBoundary: "ipchun",
  monthBoundary: "solar_terms",
  timezone: "Asia/Seoul",
  dst: false,
  localMeanTime: false,
  earlyZiHour: "early_zi",
  daewoonSect: 1,
} as const;
