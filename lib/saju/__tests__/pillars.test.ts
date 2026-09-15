import { describe, expect, it } from "vitest";
import { calculateSaju } from "../index";

describe("calculateSaju golden cases", () => {
  it("calculates 1995-12-31 08:20 Seoul female solar chart", () => {
    const result = calculateSaju({
      name: "테스트",
      gender: "female",
      year: 1995,
      month: 12,
      day: 31,
      hour: 8,
      minute: 20,
      calendar: "solar",
    });

    expect(result.pillars.year.stem).toBe("乙");
    expect(result.pillars.year.branch).toBe("亥");
    expect(result.pillars.month.stem).toBe("戊");
    expect(result.pillars.month.branch).toBe("子");
    expect(result.pillars.day.stem).toBe("丙");
    expect(result.pillars.day.branch).toBe("申");
    expect(result.pillars.hour?.stem).toBe("壬");
    expect(result.pillars.hour?.branch).toBe("辰");
    expect(result.dayMaster.stem).toBe("丙");
    expect(result.dayMaster.element).toBe("fire");
  });

  it("returns null hour pillar when birth time is unknown", () => {
    const result = calculateSaju({
      name: "테스트",
      gender: "female",
      year: 1995,
      month: 12,
      day: 31,
      calendar: "solar",
      timeUnknown: true,
    });

    expect(result.pillars.hour).toBeNull();
    expect(result.birth.timeUnknown).toBe(true);
  });

  it("uses early zi hour policy for 23:30 birth", () => {
    const result = calculateSaju({
      name: "테스트",
      gender: "female",
      year: 1995,
      month: 12,
      day: 30,
      hour: 23,
      minute: 30,
      calendar: "solar",
    });

    expect(result.pillars.day.stem).toBe("乙");
    expect(result.pillars.day.branch).toBe("未");
    expect(result.pillars.hour?.branch).toBe("子");
  });

  it("converts lunar date to solar before calculation", () => {
    const result = calculateSaju({
      name: "테스트",
      gender: "female",
      year: 1995,
      month: 11,
      day: 10,
      hour: 8,
      minute: 20,
      calendar: "lunar",
    });

    expect(result.birth.solarDate).toBe("1995-12-31");
    expect(result.pillars.day.stem).toBe("丙");
  });
});
