import { CounselorAvatar } from "@/components/counselor/CounselorAvatar";
import { VideoSection } from "@/components/layout/VideoSection";
import { Button } from "@/components/ui/Button";
import { PageContainer } from "@/components/layout/PageContainer";
import { COUNSELOR_PROFILES } from "@/lib/constants";
import { VIDEO_PATHS } from "@/lib/videos";

const features = [
  {
    number: "01",
    title: "정확한 사주",
    description: "생년월일시를 기반으로\n나만의 사주 명식을 계산합니다.",
  },
  {
    number: "02",
    title: "명리학 기반 분석",
    description: "음양오행부터 십신, 대운까지\n명리학적 구조를 바탕으로 분석합니다.",
  },
  {
    number: "03",
    title: "AI 상담",
    description: "정해진 운세가 아니라\n지금 당신이 궁금한 것을 직접 물어보세요.",
  },
];

const counselors = [
  { id: "cold", ...COUNSELOR_PROFILES.cold },
  { id: "warm", ...COUNSELOR_PROFILES.warm },
];

export default function LandingPage() {
  return (
    <PageContainer>
      <VideoSection
        src={VIDEO_PATHS.hero.forward}
        variant="hero"
        contentClassName="mx-auto max-w-5xl px-4 py-16 text-center md:py-24"
        className="animate-fade-in-up"
      >
        <div className="relative mx-auto max-w-3xl">
          <div className="pointer-events-none absolute -inset-x-8 -inset-y-6 rounded-full bg-gold/5 blur-3xl" />
          <p className="relative mb-4 text-sm tracking-[0.25em] text-gold/80">
            사주를 바탕으로 나누는 이야기
          </p>
          <h1 className="relative font-serif text-4xl leading-tight text-ivory md:text-6xl">
            당신의 운명을
            <br />
            <span className="text-gold">AI와 함께</span> 읽어보세요
          </h1>
          <p className="relative mx-auto mt-6 max-w-md text-sm leading-relaxed text-ivory/70 md:text-base">
            정확한 사주 명식과 명리학을 바탕으로
            <br />
            당신의 질문에 답합니다.
          </p>
          <div className="relative mt-10">
            <Button href="/input">내 사주 알아보기</Button>
          </div>
        </div>
      </VideoSection>

      <VideoSection
        src={VIDEO_PATHS.homeBottom.forward}
        overlayClassName="bg-navy/65"
        contentClassName="mx-auto max-w-5xl px-4"
        className="-mt-24 pt-24"
      >
        <section className="grid gap-6 py-12 md:grid-cols-3">
          {features.map((feature) => (
            <div key={feature.number} className="card-surface rounded-2xl p-6">
              <p className="mb-3 text-sm text-gold">{feature.number}</p>
              <h2 className="mb-3 font-serif text-xl text-ivory">
                {feature.title}
              </h2>
              <p className="whitespace-pre-line text-sm leading-relaxed text-ivory/60">
                {feature.description}
              </p>
            </div>
          ))}
        </section>

        <section className="py-12">
          <div className="mb-8 text-center">
            <h2 className="font-serif text-2xl text-ivory md:text-3xl">
              두 가지 스타일의 상담 방식
            </h2>
            <p className="mx-auto mt-3 max-w-md text-sm leading-relaxed text-ivory/60">
              같은 사주 명식이라도, 듣고 싶은 방식은 다를 수 있습니다.
              <br />
              상담 과정에서 원하는 스타일을 선택할 수 있습니다.
            </p>
          </div>
          <div className="grid gap-6 md:grid-cols-2">
            {counselors.map((counselor) => (
              <div
                key={counselor.id}
                className="card-surface glow-gold rounded-2xl p-8 text-center"
              >
                <CounselorAvatar
                  src={counselor.image}
                  alt={counselor.title}
                  size="lg"
                />
                <h3 className="mb-4 font-serif text-xl text-gold">
                  {counselor.title}
                </h3>
                <p className="mb-4 text-sm italic text-ivory/80">
                  &ldquo;{counselor.quote}&rdquo;
                </p>
                <p className="text-xs tracking-widest text-muted-blue">
                  {counselor.keywords}
                </p>
              </div>
            ))}
          </div>
          <div className="relative mt-8 overflow-hidden rounded-2xl border border-gold/35 bg-gradient-to-b from-navy-light/90 to-navy p-5 text-center glow-gold md:p-6">
            <div className="pointer-events-none absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-gold/80 to-transparent" />
            <div className="pointer-events-none absolute -top-16 left-1/2 h-32 w-32 -translate-x-1/2 rounded-full bg-gold/10 blur-3xl" />
            <p className="relative mb-4 font-serif text-base text-ivory md:text-lg">
              지금 바로 나만의 사주 상담을 시작해보세요
            </p>
            <Button
              href="/input"
              className="relative px-8 py-3 text-base shadow-xl shadow-gold/25"
            >
              상담받기
            </Button>
          </div>
        </section>
      </VideoSection>
    </PageContainer>
  );
}
