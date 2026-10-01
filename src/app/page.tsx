import { Ranking } from "@phosphor-icons/react/dist/ssr";
import { OverallBoard } from "@/components/leaderboard/overall-board";
import { SectionBoard, sectionAnchor } from "@/components/leaderboard/section-board";
import { GridBackground } from "@/components/lightswind/grid-dot-backgrounds";
import { getLeaderboard, OVERALL_CUTOFF, SECTION_CUTOFF } from "@/lib/leaderboard";

export default async function Home() {
  const { overall, sections } = await getLeaderboard();

  return (
    <div className="flex flex-1 flex-col">
      <GridBackground>
        <header className="mx-auto flex h-14 w-full max-w-[1400px] items-center gap-2 px-4 md:px-6">
          <Ranking size={22} weight="bold" className="text-accent" aria-hidden="true" />
          <span className="text-sm font-semibold tracking-tight">Recitation Leaderboard</span>
        </header>

        <div className="mx-auto w-full max-w-[1400px] px-4 pb-8 pt-6 md:px-6 md:pb-12 md:pt-12">
          <h1 className="text-4xl font-semibold tracking-[-0.03em] text-balance md:text-6xl">
            Recitation Points
            <span className="sr-only"> · </span>
            <span className="mt-2 block text-lg font-medium tracking-normal text-muted-foreground md:mt-3 md:text-2xl">
              2nd Term, SY 2026-2027
            </span>
          </h1>
          <p className="mt-4 max-w-[60ch] text-[15px] leading-relaxed text-muted-foreground md:text-base">
            The top {OVERALL_CUTOFF} across all six sections and the top {SECTION_CUTOFF} of each
            section. Students are listed by section and class number.
          </p>
        </div>
      </GridBackground>

      <nav aria-label="Sections" className="lg:hidden">
        <ul className="mx-auto flex max-w-[1400px] snap-x gap-2 overflow-x-auto px-4 pb-4 [scrollbar-width:none] md:px-6">
          {sections.map((s) => (
            <li key={s.section} className="snap-start">
              <a
                href={`#${sectionAnchor(s.section)}`}
                className="inline-flex h-10 items-center whitespace-nowrap rounded-lg border border-border bg-surface px-3.5 text-sm font-medium transition-colors hover:border-border-strong active:scale-[0.98]"
              >
                {s.section}
              </a>
            </li>
          ))}
        </ul>
      </nav>

      <main className="mx-auto grid w-full max-w-[1400px] flex-1 grid-cols-1 gap-6 px-4 pb-12 md:px-6 lg:grid-cols-12 lg:gap-8">
        <div className="lg:col-span-5">
          <div className="lg:sticky lg:top-6">
            <OverallBoard entries={overall} />
          </div>
        </div>

        <div className="lg:col-span-7">
          <h2 className="mb-4 text-lg font-semibold tracking-tight lg:sr-only">Section top 5</h2>
          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:gap-5">
            {sections.map((board, i) => (
              <SectionBoard key={board.section} board={board} offset={i * SECTION_CUTOFF} />
            ))}
          </div>
        </div>
      </main>

      <footer className="border-t border-border">
        <div className="mx-auto flex max-w-[1400px] flex-col gap-1 px-4 py-6 text-sm text-muted-foreground md:flex-row md:justify-between md:px-6">
          <p>Tied students share a rank, marked with T. Ties at a cutoff are all listed.</p>
          <p>Students with no points yet are not listed.</p>
        </div>
      </footer>
    </div>
  );
}
