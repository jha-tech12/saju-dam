import type { ReactNode } from "react";
import { LoopVideo } from "@/components/ui/LoopVideo";

interface VideoSectionProps {
  src: string;
  children: ReactNode;
  overlayClassName?: string;
  className?: string;
  contentClassName?: string;
  variant?: "default" | "hero";
}

export function VideoSection({
  src,
  children,
  overlayClassName = "bg-navy/60",
  className = "",
  contentClassName = "",
  variant = "default",
}: VideoSectionProps) {
  const isHero = variant === "hero";

  return (
    <section
      className={`relative left-1/2 w-screen -translate-x-1/2 overflow-hidden ${
        isHero
          ? "-mt-8 flex min-h-[calc(100svh-4.25rem)] items-center md:-mt-12"
          : ""
      } ${className}`}
    >
      <div className="pointer-events-none absolute inset-0">
        <LoopVideo
          src={src}
          className={`h-full w-full object-center ${
            isHero ? "min-h-full scale-[1.03] object-cover" : "object-cover"
          }`}
        />

        {isHero ? (
          <>
            <div className="absolute inset-0 bg-navy/30" />
            <div className="absolute inset-0 bg-[radial-gradient(ellipse_80%_70%_at_50%_45%,transparent_0%,rgba(15,23,41,0.35)_55%,rgba(15,23,41,0.92)_100%)]" />
            <div className="absolute inset-x-0 top-0 h-28 bg-gradient-to-b from-navy via-navy/50 to-transparent" />
            <div className="absolute inset-x-0 bottom-0 h-48 bg-gradient-to-t from-navy via-navy/80 to-transparent" />
            <div className="absolute inset-x-0 bottom-0 h-px bg-gradient-to-r from-transparent via-gold/20 to-transparent" />
          </>
        ) : (
          <>
            <div className={`absolute inset-0 ${overlayClassName}`} />
            <div className="absolute inset-x-0 top-0 h-24 bg-gradient-to-b from-navy/80 to-transparent" />
          </>
        )}
      </div>

      <div className={`relative z-10 w-full ${contentClassName}`}>{children}</div>
    </section>
  );
}
