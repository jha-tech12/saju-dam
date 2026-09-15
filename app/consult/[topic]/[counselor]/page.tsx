"use client";

import { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import { ChatInterface } from "@/components/chat/ChatInterface";
import { PageContainer } from "@/components/layout/PageContainer";
import type { SajuResult } from "@/lib/saju/types";
import { getSajuResult } from "@/lib/storage";

export default function ChatPage() {
  const params = useParams<{ topic: string; counselor: string }>();
  const router = useRouter();
  const [saju, setSaju] = useState<SajuResult | null>(null);

  const topic = params.topic as "basic" | "love" | "career";
  const counselor = params.counselor as "cold" | "warm";

  useEffect(() => {
    const saved = getSajuResult();
    if (!saved) {
      router.replace("/input");
      return;
    }
    setSaju(saved);
  }, [router]);

  if (!saju) {
    return (
      <PageContainer>
        <p className="text-center text-ivory/60">상담 준비 중...</p>
      </PageContainer>
    );
  }

  return (
    <PageContainer>
      <ChatInterface saju={saju} topic={topic} counselor={counselor} />
    </PageContainer>
  );
}
