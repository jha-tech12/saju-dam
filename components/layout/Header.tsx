import Link from "next/link";

export function Header() {
  return (
    <header className="sticky top-0 z-50 border-b border-gold/10 bg-navy/80 backdrop-blur-md">
      <div className="mx-auto flex max-w-5xl items-center justify-between px-4 py-4">
        <Link
          href="/"
          className="font-serif text-xl font-bold tracking-tight text-gold"
        >
          사주담
        </Link>
        <nav className="flex items-center gap-4 text-sm text-ivory/70">
          <Link href="/input" className="hover:text-gold">
            사주 입력
          </Link>
        </nav>
      </div>
    </header>
  );
}
