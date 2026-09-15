"use client";

import type { BirthInput, SajuResult } from "@/lib/saju/types";

const SAJU_KEY = "sajudam-saju-result";
const INPUT_KEY = "sajudam-saju-input";

export function saveSajuResult(result: SajuResult) {
  localStorage.setItem(SAJU_KEY, JSON.stringify(result));
}

export function getSajuResult(): SajuResult | null {
  if (typeof window === "undefined") return null;
  const raw = localStorage.getItem(SAJU_KEY);
  if (!raw) return null;
  try {
    return JSON.parse(raw) as SajuResult;
  } catch {
    return null;
  }
}

export function saveBirthInput(input: BirthInput) {
  localStorage.setItem(INPUT_KEY, JSON.stringify(input));
}

export function getBirthInput(): BirthInput | null {
  if (typeof window === "undefined") return null;
  const raw = localStorage.getItem(INPUT_KEY);
  if (!raw) return null;
  try {
    return JSON.parse(raw) as BirthInput;
  } catch {
    return null;
  }
}
