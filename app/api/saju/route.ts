import { NextResponse } from "next/server";
import { z } from "zod";
import { calculateSaju } from "@/lib/saju";

const birthSchema = z.object({
  name: z.string().min(1),
  gender: z.enum(["male", "female"]),
  year: z.number().int().min(1900).max(2100),
  month: z.number().int().min(1).max(12),
  day: z.number().int().min(1).max(31),
  hour: z.number().int().min(0).max(23).optional(),
  minute: z.number().int().min(0).max(59).optional(),
  calendar: z.enum(["solar", "lunar"]),
  isLeapMonth: z.boolean().optional(),
  timeUnknown: z.boolean().optional(),
  approximateTimeLabel: z.string().optional(),
});

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const input = birthSchema.parse(body);
    const result = calculateSaju(input);
    return NextResponse.json(result);
  } catch (error) {
    const message =
      error instanceof z.ZodError
        ? "입력값이 올바르지 않습니다."
        : error instanceof Error
          ? error.message
          : "사주 계산 중 오류가 발생했습니다.";
    return NextResponse.json({ error: message }, { status: 400 });
  }
}
