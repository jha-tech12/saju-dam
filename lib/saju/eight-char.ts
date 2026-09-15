import { Solar } from "lunar-typescript";

export type EightChar = ReturnType<
  ReturnType<ReturnType<typeof Solar.fromYmdHms>["getLunar"]>["getEightChar"]
>;
