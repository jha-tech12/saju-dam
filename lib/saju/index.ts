import { CALCULATION_POLICY } from "./constants";
import { calculateDaewoon, calculateSeun } from "./luck";
import {
  calculateFiveElements,
  calculateRelations,
  calculateStrength,
  extractHiddenStems,
  extractTenGods,
} from "./myungri";
import {
  createEightChar,
  extractPillars,
  getDayMaster,
} from "./pillars";
import type { BirthInput, SajuResult } from "./types";

function pad(value: number): string {
  return String(value).padStart(2, "0");
}

export function calculateSaju(input: BirthInput): SajuResult {
  const { eightChar, solarDate } = createEightChar(input);
  const pillars = extractPillars(eightChar, input.timeUnknown ?? false);
  const dayMaster = getDayMaster(pillars.day.stem);
  const fiveElements = calculateFiveElements(pillars);
  const tenGods = extractTenGods(eightChar, input.timeUnknown ?? false);
  const hiddenStems = extractHiddenStems(
    pillars,
    eightChar,
    input.timeUnknown ?? false,
  );
  const relations = calculateRelations(pillars);
  const strength = calculateStrength(
    dayMaster.element,
    pillars.month.branch,
    fiveElements,
  );
  const daewoon = calculateDaewoon(eightChar, input.gender);
  const seun = calculateSeun();

  const time =
    input.timeUnknown || input.hour === undefined
      ? null
      : `${pad(input.hour)}:${pad(input.minute ?? 0)}`;

  return {
    birth: {
      name: input.name,
      date: `${input.year}-${pad(input.month)}-${pad(input.day)}`,
      time,
      gender: input.gender,
      calendar: input.calendar,
      isLeapMonth: input.isLeapMonth ?? false,
      timeUnknown: input.timeUnknown ?? false,
      approximateTimeLabel: input.approximateTimeLabel ?? null,
      solarDate,
    },
    pillars,
    dayMaster,
    fiveElements,
    tenGods,
    hiddenStems,
    relations,
    strength,
    daewoon,
    seun,
    calculationPolicy: CALCULATION_POLICY,
  };
}

export * from "./types";
