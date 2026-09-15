import { Solar } from "lunar-typescript";
import type { EightChar } from "./eight-char";
import { splitGanZhi } from "./pillars";
import type { DaewoonEntry, Gender, SeunEntry } from "./types";

export function calculateDaewoon(
  eightChar: EightChar,
  gender: Gender,
): DaewoonEntry[] {
  const genderCode = gender === "male" ? 1 : 0;
  const yun = eightChar.getYun(genderCode, 1);
  const daYunList = yun.getDaYun();

  return daYunList
    .slice(1, 9)
    .map((item) => {
      const ganZhi = item.getGanZhi();
      const { stem, branch } = splitGanZhi(ganZhi);
      return {
        startAge: item.getStartAge(),
        ganZhi,
        stem,
        branch,
      };
    });
}

export function calculateSeun(year: number = new Date().getFullYear()): SeunEntry {
  const solar = Solar.fromYmdHms(year, 6, 15, 12, 0, 0);
  const eightChar = solar.getLunar().getEightChar();
  const ganZhi = eightChar.getYear();
  const { stem, branch } = splitGanZhi(ganZhi);

  return {
    year,
    ganZhi,
    stem,
    branch,
  };
}
