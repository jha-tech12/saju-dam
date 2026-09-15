"use client";

import { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import { CounselorAvatar } from "@/components/counselor/CounselorAvatar";
import { PageContainer } from "@/components/layout/PageContainer";
import { Button } from "@/components/ui/Button";
import { COUNSELOR_PROFILES, TOPIC_LABELS } from "@/lib/constants";
import type { CounselorType } from "@/lib/ai/personas";
import { getSajuResult } from "@/lib/storage";

const counselors = [
  { id: "cold" as const, ...COUNSELOR_PROFILES.cold },
  { id: "warm" as const, ...COUNSELOR_PROFILES.warm },
];

export default function CounselorSelectPage() {
  const params = useParams<{ topic: string }>();
  const router = useRouter();
  const topic = params.topic as keyof typeof TOPIC_LABELS;
  const [selectedId, setSelectedId] = useState<CounselorType | null>(null);
  const [isNavigating, setIsNavigating] = useState(false);

  useEffect(() => {
    if (!getSajuResult()) {
      router.replace("/input");
    }
  }, [router]);

  function handleSelect(id: CounselorType) {
    if (isNavigating) return;

    setSelectedId(id);
    setIsNavigating(true);

    window.setTimeout(() => {
      router.push(`/consult/${topic}/${id}`);
    }, 400);
  }

  return (
    <PageContainer backgroundVideo="/videos/main_bg.mp4">
      <div className="mx-auto max-w-3xl text-center">
        <p className="mb-2 text-sm text-gold/70">
          {TOPIC_LABELS[topic] ?? "상담"}
        </p>
        <h1 className="mb-3 font-serif text-3xl text-ivory">
          누구에게 물어볼까요?
        </h1>
        <p className="mb-8 text-sm leading-relaxed text-ivory/60">
          같은 사주라도 듣고 싶은 방식은 다를 수 있어요.
          <br />
          아래 두 스타일 중 편한 상담가를 선택해주세요.
        </p>

        <div className="grid gap-6 md:grid-cols-2">
          {counselors.map((counselor) => {
            const isSelected = selectedId === counselor.id;
            const isDimmed = selectedId !== null && !isSelected;

            return (
              <div
                key={counselor.id}
                className={`card-surface rounded-2xl p-8 text-left transition-all duration-300 ${
                  isSelected
                    ? "border border-gold/60 bg-gold/5 ring-2 ring-gold/35 shadow-lg shadow-gold/20"
                    : isDimmed
                      ? "border border-transparent opacity-50"
                      : "border border-transparent glow-gold"
                }`}
              >
                <CounselorAvatar
                  src={counselor.image}
                  alt={counselor.title}
                  size="lg"
                />
                <h2 className="mb-2 text-center font-serif text-xl text-gold">
                  {counselor.title}
                </h2>
                <p className="mb-4 text-center text-sm italic text-ivory/80">
                  &ldquo;{counselor.quote}&rdquo;
                </p>
                <p className="mb-4 text-sm leading-relaxed text-ivory/70">
                  {counselor.description}
                </p>
                <p className="mb-6 text-center text-xs tracking-widest text-muted-blue">
                  {counselor.keywords}
                </p>
                <div className="text-center">
                  <Button
                    onClick={() => handleSelect(counselor.id)}
                    disabled={isNavigating}
                    variant={isSelected ? "primary" : "secondary"}
                    className={`w-full px-8 py-3.5 text-sm ${
                      isSelected ? "shadow-xl shadow-gold/25" : ""
                    }`}
                  >
                    {isSelected ? "선택됨 ✓" : "선택"}
                  </Button>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </PageContainer>
  );
}
