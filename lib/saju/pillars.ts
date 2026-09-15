import { Lunar, Solar } from "lunar-typescript";
import type { EightChar } from "./eight-char";
import {
  BRANCH_ELEMENT,
  STEM_ELEMENT,
  STEM_YIN_YANG,
} from "./constants";
import type { BirthInput, Pillar } from "./types";

function pad(value: number): string {
  return String(value).padStart(2, "0");
}

export function toSolarDate(input: BirthInput): {
  year: number;
  month: number;
  day: number;
  solarDate: string;
} {
  if (input.calendar === "solar") {
    const solarDate = `${input.year}-${pad(input.month)}-${pad(input.day)}`;
    return {
      year: input.year,
      month: input.month,
      day: input.day,
      solarDate,
    };
  }

  const lunarMonth =
    input.isLeapMonth && input.month > 0 ? -input.month : input.month;
  const lunar = Lunar.fromYmd(input.year, lunarMonth, input.day);
  const solar = lunar.getSolar();
  return {
    year: solar.getYear(),
    month: solar.getMonth(),
    day: solar.getDay(),
    solarDate: solar.toYmd(),
  };
}

export function createEightChar(input: BirthInput): {
  eightChar: EightChar;
  solarDate: string;
} {
  const solarParts = toSolarDate(input);
  const hour = input.timeUnknown ? 12 : (input.hour ?? 12);
  const minute = input.timeUnknown ? 0 : (input.minute ?? 0);

  const solar = Solar.fromYmdHms(
    solarParts.year,
    solarParts.month,
    solarParts.day,
    hour,
    minute,
    0,
  );
  const eightChar = solar.getLunar().getEightChar();
  eightChar.setSect(2);

  return { eightChar, solarDate: solarParts.solarDate };
}

export function splitGanZhi(ganZhi: string): { stem: string; branch: string } {
  return {
    stem: ganZhi.charAt(0),
    branch: ganZhi.charAt(1),
  };
}

export function toPillar(ganZhi: string): Pillar {
  const { stem, branch } = splitGanZhi(ganZhi);
  return {
    stem,
    branch,
    stemElement: STEM_ELEMENT[stem],
    branchElement: BRANCH_ELEMENT[branch],
  };
}

export function extractPillars(
  eightChar: EightChar,
  timeUnknown: boolean,
): {
  year: Pillar;
  month: Pillar;
  day: Pillar;
  hour: Pillar | null;
} {
  return {
    year: toPillar(eightChar.getYear()),
    month: toPillar(eightChar.getMonth()),
    day: toPillar(eightChar.getDay()),
    hour: timeUnknown ? null : toPillar(eightChar.getTime()),
  };
}

export function getDayMaster(dayStem: string) {
  return {
    stem: dayStem,
    element: STEM_ELEMENT[dayStem],
    yinYang: STEM_YIN_YANG[dayStem],
  };
}
