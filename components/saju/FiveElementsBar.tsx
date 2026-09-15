import { ELEMENT_COLORS, ELEMENT_LABELS_KO } from "@/lib/constants";
import type { Element } from "@/lib/saju/types";

interface FiveElementsBarProps {
  fiveElements: Record<Element, number>;
  dominantElement?: Element;
}

const ORDER: Element[] = ["wood", "fire", "earth", "metal", "water"];

export function FiveElementsBar({
  fiveElements,
  dominantElement,
}: FiveElementsBarProps) {
  const max = Math.max(...Object.values(fiveElements), 1);

  return (
    <div className="card-surface rounded-2xl p-6">
      <h3 className="mb-4 font-serif text-xl text-gold">오행의 균형</h3>
      <div className="space-y-3">
        {ORDER.map((element) => {
          const count = fiveElements[element];
          const width = `${(count / max) * 100}%`;
          return (
            <div key={element} className="flex items-center gap-3">
              <span className="w-20 text-sm text-ivory/70">
                {ELEMENT_LABELS_KO[element]}
              </span>
              <div className="h-3 flex-1 rounded-full bg-navy-light">
                <div
                  className={`h-3 rounded-full transition-all ${ELEMENT_COLORS[element]}`}
                  style={{ width: width || "4%" }}
                />
              </div>
              <span className="w-6 text-right text-sm text-ivory/60">
                {count}
              </span>
            </div>
          );
        })}
      </div>
      {dominantElement && (
        <p className="mt-4 text-sm text-ivory/80">
          당신의 사주에서 가장 두드러지는 기운은{" "}
          <span className="text-gold">
            {ELEMENT_LABELS_KO[dominantElement]}
          </span>
          입니다.
        </p>
      )}
    </div>
  );
}

function getDominantElement(
  fiveElements: Record<Element, number>,
): Element {
  return ORDER.reduce((best, current) =>
    fiveElements[current] > fiveElements[best] ? current : best,
  );
}

FiveElementsBar.getDominantElement = getDominantElement;

export { getDominantElement };
