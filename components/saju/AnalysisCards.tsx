interface AnalysisCardsProps {
  cards: {
    title: string;
    content: string;
  }[];
}

export function AnalysisCardsSkeleton() {
  return (
    <div className="space-y-4" aria-busy="true" aria-label="성향 분석 중">
      <div className="flex items-center justify-between">
        <h3 className="font-serif text-xl text-gold">당신의 핵심 성향</h3>
        <span className="text-xs text-gold/70">분석 중...</span>
      </div>
      <div className="grid gap-4 md:grid-cols-3">
        {[0, 1, 2].map((index) => (
          <div
            key={index}
            className="card-surface animate-pulse rounded-2xl p-5"
          >
            <div className="mb-3 h-3 w-8 rounded bg-ivory/10" />
            <div className="mb-3 h-5 w-3/5 rounded bg-ivory/15" />
            <div className="space-y-2">
              <div className="h-3 w-full rounded bg-ivory/10" />
              <div className="h-3 w-full rounded bg-ivory/10" />
              <div className="h-3 w-4/5 rounded bg-ivory/10" />
              <div className="h-3 w-2/3 rounded bg-ivory/10" />
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

export function AnalysisCards({ cards }: AnalysisCardsProps) {
  return (
    <div className="space-y-4">
      <h3 className="font-serif text-xl text-gold">당신의 핵심 성향</h3>
      <div className="grid gap-4 md:grid-cols-3">
        {cards.map((card, index) => (
          <div key={card.title} className="card-surface rounded-2xl p-5">
            <p className="mb-2 text-xs text-gold/70">
              {String(index + 1).padStart(2, "0")}
            </p>
            <h4 className="mb-2 font-medium text-ivory">{card.title}</h4>
            <p className="text-sm leading-relaxed text-ivory/70">
              {card.content}
            </p>
          </div>
        ))}
      </div>
    </div>
  );
}
