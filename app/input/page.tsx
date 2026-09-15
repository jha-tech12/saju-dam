"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { PageContainer } from "@/components/layout/PageContainer";
import { Button } from "@/components/ui/Button";
import {
  APPROXIMATE_TIME_SLOTS,
  type ApproximateTimeSlotId,
} from "@/lib/constants";
import type { BirthInput, CalendarType, Gender } from "@/lib/saju/types";
import { saveBirthInput, saveSajuResult } from "@/lib/storage";

const CURRENT_YEAR = new Date().getFullYear();
const BIRTH_YEARS = Array.from(
  { length: CURRENT_YEAR - 1950 + 1 },
  (_, index) => String(CURRENT_YEAR - index),
);
const BIRTH_MONTHS = Array.from({ length: 12 }, (_, index) =>
  String(index + 1).padStart(2, "0"),
);
const BIRTH_HOURS = Array.from({ length: 24 }, (_, index) =>
  String(index).padStart(2, "0"),
);
const BIRTH_MINUTES = Array.from({ length: 60 }, (_, index) =>
  String(index).padStart(2, "0"),
);

function getDaysInMonth(year: number, month: number) {
  return new Date(year, month, 0).getDate();
}

function clampDay(year: string, month: string, day: string) {
  if (!year || !month || !day) return day;
  const maxDay = getDaysInMonth(Number(year), Number(month));
  return Number(day) > maxDay ? String(maxDay).padStart(2, "0") : day;
}

export default function InputPage() {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [form, setForm] = useState({
    name: "",
    gender: "female" as Gender,
    year: "1990",
    month: "01",
    day: "01",
    hour: "",
    minute: "",
    calendar: "solar" as CalendarType,
    isLeapMonth: false,
    timeUnknown: false,
    approximateTimeSlot: "unknown" as ApproximateTimeSlotId,
  });

  async function handleSubmit(event: React.FormEvent) {
    event.preventDefault();
    setLoading(true);
    setError("");

    if (!form.year || !form.month || !form.day) {
      setError("생년월일을 선택해주세요.");
      setLoading(false);
      return;
    }

    if (!form.timeUnknown && (!form.hour || !form.minute)) {
      setError("출생시간을 선택해주세요.");
      setLoading(false);
      return;
    }

    let timeFields: Pick<
      BirthInput,
      "timeUnknown" | "hour" | "minute" | "approximateTimeLabel"
    > = {
      timeUnknown: false,
      hour: Number(form.hour),
      minute: Number(form.minute),
    };

    if (form.timeUnknown) {
      const slot = APPROXIMATE_TIME_SLOTS.find(
        (item) => item.id === form.approximateTimeSlot,
      );

      if (!slot) {
        setError("대략적 시간대를 선택해주세요.");
        setLoading(false);
        return;
      }

      if ("timeUnknown" in slot && slot.timeUnknown) {
        timeFields = { timeUnknown: true };
      } else if ("hour" in slot) {
        timeFields = {
          timeUnknown: false,
          hour: slot.hour,
          minute: slot.minute,
          approximateTimeLabel: slot.label,
        };
      }
    }

    const input: BirthInput = {
      name: form.name.trim(),
      gender: form.gender,
      year: Number(form.year),
      month: Number(form.month),
      day: Number(form.day),
      calendar: form.calendar,
      isLeapMonth: form.isLeapMonth,
      ...timeFields,
    };

    try {
      const response = await fetch("/api/saju", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(input),
      });

      if (!response.ok) {
        const data = await response.json();
        throw new Error(data.error ?? "사주 계산에 실패했습니다.");
      }

      const result = await response.json();
      saveBirthInput(input);
      saveSajuResult(result);
      router.push("/result");
    } catch (err) {
      setError(err instanceof Error ? err.message : "오류가 발생했습니다.");
    } finally {
      setLoading(false);
    }
  }

  const dayOptions =
    form.year && form.month
      ? Array.from(
          { length: getDaysInMonth(Number(form.year), Number(form.month)) },
          (_, index) => String(index + 1).padStart(2, "0"),
        )
      : [];

  function updateBirthDate(
    field: "year" | "month" | "day",
    value: string,
  ) {
    const next = { ...form, [field]: value };
    if (field === "year" || field === "month") {
      next.day = clampDay(next.year, next.month, next.day);
    }
    setForm(next);
  }

  function toggleTimeUnknown(checked: boolean) {
    setForm({
      ...form,
      timeUnknown: checked,
      hour: checked ? "" : form.hour,
      minute: checked ? "" : form.minute,
      approximateTimeSlot: checked ? "unknown" : form.approximateTimeSlot,
    });
  }

  return (
    <PageContainer backgroundVideo="/videos/main_bg.mp4">
      <div className="mx-auto max-w-lg">
        <h1 className="mb-2 text-center font-serif text-3xl text-gold">
          나의 사주를 알려주세요
        </h1>
        <p className="mb-8 text-center text-sm text-ivory/60">
          정확한 명식 계산을 위해 출생 정보를 입력해주세요.
        </p>

        <form onSubmit={handleSubmit} className="card-surface space-y-5 rounded-2xl p-6">
          <Field label="이름">
            <input
              required
              value={form.name}
              onChange={(e) => setForm({ ...form, name: e.target.value })}
              className="input-field"
              placeholder="이름"
            />
          </Field>

          <Field label="성별">
            <div className="flex gap-3">
              {(["female", "male"] as Gender[]).map((gender) => (
                <button
                  key={gender}
                  type="button"
                  onClick={() => setForm({ ...form, gender })}
                  className={`flex-1 rounded-xl py-3 text-sm transition ${
                    form.gender === gender
                      ? "bg-gold text-navy"
                      : "bg-navy-light text-ivory/70"
                  }`}
                >
                  {gender === "female" ? "여성" : "남성"}
                </button>
              ))}
            </div>
          </Field>

          <Field label="생년월일">
            <div className="grid grid-cols-3 gap-2">
              <select
                required
                value={form.year}
                onChange={(e) => updateBirthDate("year", e.target.value)}
                className="input-field"
                aria-label="년"
              >
                {BIRTH_YEARS.map((year) => (
                  <option key={year} value={year}>
                    {year}년
                  </option>
                ))}
              </select>
              <select
                required
                value={form.month}
                onChange={(e) => updateBirthDate("month", e.target.value)}
                className="input-field"
                aria-label="월"
              >
                {BIRTH_MONTHS.map((month) => (
                  <option key={month} value={month}>
                    {month}월
                  </option>
                ))}
              </select>
              <select
                required
                value={form.day}
                onChange={(e) => updateBirthDate("day", e.target.value)}
                className="input-field"
                aria-label="일"
              >
                {dayOptions.map((day) => (
                  <option key={day} value={day}>
                    {day}일
                  </option>
                ))}
              </select>
            </div>
          </Field>

          <Field label="출생시간">
            <div className="grid grid-cols-2 gap-2">
              <select
                required={!form.timeUnknown}
                disabled={form.timeUnknown}
                value={form.hour}
                onChange={(e) => setForm({ ...form, hour: e.target.value })}
                className="input-field select-placeholder disabled:opacity-40"
                aria-label="시"
              >
                <option value="" hidden>
                  --
                </option>
                {BIRTH_HOURS.map((hour) => (
                  <option key={hour} value={hour}>
                    {hour}시
                  </option>
                ))}
              </select>
              <select
                required={!form.timeUnknown}
                disabled={form.timeUnknown}
                value={form.minute}
                onChange={(e) => setForm({ ...form, minute: e.target.value })}
                className="input-field select-placeholder disabled:opacity-40"
                aria-label="분"
              >
                <option value="" hidden>
                  --
                </option>
                {BIRTH_MINUTES.map((minute) => (
                  <option key={minute} value={minute}>
                    {minute}분
                  </option>
                ))}
              </select>
            </div>
            <label className="mt-2 flex items-center gap-2 text-sm text-ivory/60">
              <input
                type="checkbox"
                checked={form.timeUnknown}
                onChange={(e) => toggleTimeUnknown(e.target.checked)}
              />
              출생시간을 모릅니다
            </label>
            {form.timeUnknown && (
              <div className="mt-3">
                <label className="mb-2 block text-sm text-muted-blue">
                  대략적 시간대 (선택)
                </label>
                <select
                  value={form.approximateTimeSlot}
                  onChange={(e) =>
                    setForm({
                      ...form,
                      approximateTimeSlot: e.target
                        .value as ApproximateTimeSlotId,
                    })
                  }
                  className="input-field"
                >
                  {APPROXIMATE_TIME_SLOTS.map((slot) => (
                    <option key={slot.id} value={slot.id}>
                      {slot.label}
                    </option>
                  ))}
                </select>
              </div>
            )}
          </Field>

          <Field label="달력">
            <div className="flex gap-3">
              {(["solar", "lunar"] as CalendarType[]).map((calendar) => (
                <button
                  key={calendar}
                  type="button"
                  onClick={() => setForm({ ...form, calendar })}
                  className={`flex-1 rounded-xl py-3 text-sm transition ${
                    form.calendar === calendar
                      ? "bg-gold text-navy"
                      : "bg-navy-light text-ivory/70"
                  }`}
                >
                  {calendar === "solar" ? "양력" : "음력"}
                </button>
              ))}
            </div>
            {form.calendar === "lunar" && (
              <label className="mt-2 flex items-center gap-2 text-sm text-ivory/60">
                <input
                  type="checkbox"
                  checked={form.isLeapMonth}
                  onChange={(e) =>
                    setForm({ ...form, isLeapMonth: e.target.checked })
                  }
                />
                윤달입니다
              </label>
            )}
          </Field>

          {error && <p className="text-sm text-red-400">{error}</p>}

          <Button type="submit" disabled={loading} className="w-full">
            {loading ? "계산 중..." : "사주 분석하기"}
          </Button>
        </form>
      </div>

      <style jsx global>{`
        .input-field {
          width: 100%;
          border-radius: 0.75rem;
          background: rgba(26, 39, 68, 0.8);
          padding: 0.75rem 1rem;
          color: #f5f1e8;
          outline: none;
        }
        .input-field:focus {
          box-shadow: 0 0 0 1px rgba(201, 161, 92, 0.5);
        }
        select.input-field {
          cursor: pointer;
          appearance: none;
          background-image: url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='12' height='12' viewBox='0 0 24 24' fill='none' stroke='%23c9a15c' stroke-width='2'%3E%3Cpath d='M6 9l6 6 6-6'/%3E%3C/svg%3E");
          background-repeat: no-repeat;
          background-position: right 1rem center;
          padding-right: 2.5rem;
        }
        select.input-field.select-placeholder:invalid {
          color: rgba(245, 241, 232, 0.4);
        }
        select.input-field option {
          background: #1a2744;
          color: #f5f1e8;
        }
        select.input-field option[value=""] {
          color: rgba(245, 241, 232, 0.4);
        }
      `}</style>
    </PageContainer>
  );
}

function Field({
  label,
  children,
}: {
  label: string;
  children: React.ReactNode;
}) {
  return (
    <div>
      <label className="mb-2 block text-sm text-ivory/70">{label}</label>
      {children}
    </div>
  );
}
