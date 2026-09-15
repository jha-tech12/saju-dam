import type { ReactNode } from "react";
import { LoopVideo } from "@/components/ui/LoopVideo";
import { Header } from "./Header";

interface PageContainerProps {
  children: ReactNode;
  backgroundVideo?: string;
}

export function PageContainer({
  children,
  backgroundVideo,
}: PageContainerProps) {
  return (
    <div className="relative min-h-screen bg-navy">
      {backgroundVideo && (
        <div className="pointer-events-none fixed inset-0 z-0">
          <LoopVideo
            src={backgroundVideo}
            className="h-full w-full object-cover"
          />
          <div className="absolute inset-0 bg-navy/75" />
        </div>
      )}
      <div className="relative z-10">
        <Header />
        <main className="mx-auto max-w-5xl px-4 py-8 md:py-12">{children}</main>
      </div>
    </div>
  );
}
