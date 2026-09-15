export type Gender = "male" | "female";
export type CalendarType = "solar" | "lunar";
export type Element = "wood" | "fire" | "earth" | "metal" | "water";
export type YinYang = "yang" | "yin";
export type StrengthLevel = "strong" | "weak" | "balanced";

export interface BirthInput {
  name: string;
  gender: Gender;
  year: number;
  month: number;
  day: number;
  hour?: number;
  minute?: number;
  calendar: CalendarType;
  isLeapMonth?: boolean;
  timeUnknown?: boolean;
  approximateTimeLabel?: string;
}

export interface Pillar {
  stem: string;
  branch: string;
  stemElement: Element;
  branchElement: Element;
}

export interface TenGodEntry {
  position: string;
  stem?: string;
  tenGod: string;
}

export interface HiddenStemEntry {
  branch: string;
  position: string;
  stems: string[];
  tenGods: string[];
}

export interface RelationEntry {
  type: "합" | "충" | "형" | "파" | "해";
  source: string;
  target: string;
  description: string;
}

export interface DaewoonEntry {
  startAge: number;
  ganZhi: string;
  stem: string;
  branch: string;
}

export interface SeunEntry {
  year: number;
  ganZhi: string;
  stem: string;
  branch: string;
}

export interface CalculationPolicy {
  yearBoundary: "ipchun";
  monthBoundary: "solar_terms";
  timezone: "Asia/Seoul";
  dst: false;
  localMeanTime: false;
  earlyZiHour: "early_zi";
  daewoonSect: 1;
}

export interface SajuResult {
  birth: {
    name: string;
    date: string;
    time: string | null;
    gender: Gender;
    calendar: CalendarType;
    isLeapMonth: boolean;
    timeUnknown: boolean;
    approximateTimeLabel: string | null;
    solarDate: string;
  };
  pillars: {
    year: Pillar;
    month: Pillar;
    day: Pillar;
    hour: Pillar | null;
  };
  dayMaster: {
    stem: string;
    element: Element;
    yinYang: YinYang;
  };
  fiveElements: Record<Element, number>;
  tenGods: {
    stems: TenGodEntry[];
    branches: TenGodEntry[];
  };
  hiddenStems: HiddenStemEntry[];
  relations: RelationEntry[];
  strength: {
    level: StrengthLevel;
    label: string;
    supportElements: Element[];
    candidateYongsin: Element[];
  };
  daewoon: DaewoonEntry[];
  seun: SeunEntry;
  calculationPolicy: CalculationPolicy;
}
