"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import {
  AnalysisCards,
  AnalysisCardsSkeleton,
} from "@/components/saju/AnalysisCards";
import { FiveElementsBar, getDominantElement } from "@/components/saju/FiveElementsBar";
import { PillarChart } from "@/components/saju/PillarChart";
import Link from "next/link";
import { PageContainer } from "@/components/layout/PageContainer";
import type { SajuResult } from "@/lib/saju/types";
import { getSajuResult } from "@/lib/storage";

const CONSULT_TOPICS = [
  {
    href: "/consult/basic",
    emoji: "🔮",
    label: "기본 사주",
    description: "나의 사주 핵심 해석",
  },
  {
    href: "/consult/love",
    emoji: "💕",
    label: "연애가 궁금해요",
    description: "연애·인연·결혼운",
  },
  {
    href: "/consult/career",
    emoji: "💼",
    label: "일이 잘 풀릴까요?",
    description: "직업·재물·성장운",
  },
] as const;

export default function ResultPage() {
  const router = useRouter();
  const [result, setResult] = useState<SajuResult | null>(null);
  const [cards, setCards] = useState<{ title: string; content: string }[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const saved = getSajuResult();
    if (!saved) {
      router.replace("/input");
      return;
    }
    setResult(saved);

    async function fetchAnalysis() {
      try {
        const response = await fetch("/api/analyze", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ saju: saved }),
        });
        if (response.ok) {
          const data = await response.json();
          setCards(data.cards ?? []);
        }
      } finally {
        setLoading(false);
      }
    }

    fetchAnalysis();
  }, [router]);

  if (!result) {
    return (
      <PageContainer backgroundVideo="/videos/main_bg.mp4">
        <p className="text-center text-ivory/60">명식을 불러오는 중...</p>
      </PageContainer>
    );
  }

  const dominant = getDominantElement(result.fiveElements);

  return (
    <PageContainer backgroundVideo="/videos/main_bg.mp4">
      <div className="space-y-8">
        <PillarChart
          pillars={result.pillars}
          name={result.birth.name}
          date={result.birth.solarDate}
          time={result.birth.time}
          approximateTimeLabel={result.birth.approximateTimeLabel}
        />

        <FiveElementsBar
          fiveElements={result.fiveElements}
          dominantElement={dominant}
        />

        <div className="card-surface rounded-2xl p-6">
          <h3 className="mb-2 font-serif text-xl text-gold">일간 · 강약</h3>
          <p className="text-sm text-ivory/70">
            일간 <span className="text-gold">{result.dayMaster.stem}</span> (
            {result.strength.label}) · 현재 세운{" "}
            <span className="text-gold">{result.seun.ganZhi}</span>
          </p>
          {result.birth.timeUnknown && (
            <p className="mt-2 text-xs text-amber-400/80">
              출생시간이 없어 시주 해석은 제한됩니다.
            </p>
          )}
        </div>

        {loading ? (
          <AnalysisCardsSkeleton />
        ) : (
          cards.length > 0 && <AnalysisCards cards={cards} />
        )}

        <section className="animate-fade-in-up relative overflow-hidden rounded-2xl border border-gold/35 bg-gradient-to-b from-navy-light/90 to-navy p-8 text-center glow-gold md:p-10">
          <div className="pointer-events-none absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-gold/80 to-transparent" />
          <div className="pointer-events-none absolute -top-24 left-1/2 h-48 w-48 -translate-x-1/2 rounded-full bg-gold/10 blur-3xl" />

          <p className="relative mb-3 text-xs font-medium tracking-[0.35em] text-gold/80">
            NEXT STEP
          </p>
          <h3 className="relative mb-3 font-serif text-2xl text-gold md:text-3xl">
            이제, 궁금한 것을 물어보세요
          </h3>
          <p className="relative mb-8 text-sm text-ivory/70 md:text-base">
            원하는 상담 주제를 선택해주세요.
          </p>

          <div className="relative grid gap-4 md:grid-cols-3">
            {CONSULT_TOPICS.map((topic) => (
              <Link
                key={topic.href}
                href={topic.href}
                className="group card-surface flex flex-col items-center gap-3 rounded-2xl border border-gold/20 p-6 transition-all hover:-translate-y-0.5 hover:border-gold/50 hover:bg-gold/5 hover:shadow-lg hover:shadow-gold/15"
              >
                <span
                  className="text-3xl transition-transform group-hover:scale-110"
                  aria-hidden
                >
                  {topic.emoji}
                </span>
                <span className="font-medium text-ivory transition-colors group-hover:text-gold">
                  {topic.label}
                </span>
                <span className="text-xs text-ivory/50 transition-colors group-hover:text-ivory/70">
                  {topic.description}
                </span>
              </Link>
            ))}
          </div>
        </section>
      </div>
    </PageContainer>
  );
}
