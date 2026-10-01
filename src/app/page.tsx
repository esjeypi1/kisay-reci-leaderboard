import { OverallBoard } from "@/components/leaderboard/overall-board";
import { RefreshButton } from "@/components/leaderboard/refresh-button";
import { SectionBoard, sectionAnchor } from "@/components/leaderboard/section-board";
import { getLeaderboard, OVERALL_CUTOFF, SECTION_CUTOFF } from "@/lib/leaderboard";

const timeFormat = new Intl.DateTimeFormat("en-PH", {
  hour: "numeric",
  minute: "2-digit",
  timeZone: "Asia/Manila",
});

export default async function Home() {
  const { overall, sections } = await getLeaderboard();
  const asOf = timeFormat.format(new Date());
  const empty = overall.length === 0;

  return (
    <div className="flex flex-1 flex-col">
      <header className="mx-auto flex w-full max-w-[1400px] flex-col gap-5 px-4 pb-6 pt-8 md:px-6 lg:flex-row lg:items-end lg:justify-between lg:pb-8 lg:pt-10">
        <div>
          <h1 className="text-[2rem] font-semibold leading-tight tracking-[-0.03em] md:text-4xl lg:text-5xl">
            Recitation Points
            <span className="sr-only"> · </span>
            <span className="mt-1 block text-lg font-medium tracking-normal text-muted-foreground md:text-xl lg:mt-2">
              2nd Term, SY 2026-2027
            </span>
          </h1>
          <p className="mt-3 max-w-[60ch] text-[15px] leading-relaxed text-muted-foreground lg:hidden">
            The top {OVERALL_CUTOFF} across all six sections and the top {SECTION_CUTOFF} of each
            section, listed by section and class number.
          </p>
        </div>
        <div className="flex items-center gap-3">
          <p className="text-sm text-muted-foreground">
            As of <time className="font-mono font-medium text-foreground tabular-nums">{asOf}</time>
          </p>
          <RefreshButton />
        </div>
      </header>

      {!empty && (
        <nav
          aria-label="Jump to"
          className="sticky top-0 z-20 border-b border-border bg-background lg:hidden"
        >
          <ul className="mx-auto flex max-w-[1400px] snap-x scroll-px-4 gap-2 overflow-x-auto px-4 py-2.5 [scrollbar-width:none] md:scroll-px-6 md:px-6">
            {[{ href: "#overall", label: "Overall" }, ...sections.map((s) => ({ href: `#${sectionAnchor(s.section)}`, label: s.section }))].map(
              (link) => (
                <li key={link.href} className="snap-start">
                  <a
                    href={link.href}
                    className="inline-flex h-11 items-center whitespace-nowrap rounded-lg border border-border bg-surface px-3.5 text-sm font-medium transition-colors hover:border-border-strong active:scale-[0.98]"
                  >
                    {link.label}
                  </a>
                </li>
              ),
            )}
          </ul>
        </nav>
      )}

      <main className="mx-auto w-full max-w-[1400px] flex-1 px-4 pb-12 pt-5 md:px-6 lg:pt-0">
        {empty ? (
          <div className="rounded-xl border border-border bg-surface px-6 py-14 text-center">
            <h2 className="text-lg font-semibold tracking-tight">No points recorded yet</h2>
            <p className="mx-auto mt-2 max-w-[48ch] text-muted-foreground">
              The leaderboards fill in as recitation points are awarded. Students appear once they
              have at least one point.
            </p>
          </div>
        ) : (
          <div className="grid grid-cols-1 gap-6 lg:grid-cols-12 lg:gap-8">
            <div className="lg:col-span-5">
              <OverallBoard entries={overall} />
            </div>
            <div className="lg:col-span-7">
              <h2 className="mb-4 text-lg font-semibold tracking-tight lg:sr-only">Section top 5</h2>
              <div className="grid grid-cols-1 items-start gap-4 sm:grid-cols-2 lg:gap-5">
                {sections.map((board, i) => (
                  <SectionBoard key={board.section} board={board} offset={i * SECTION_CUTOFF} />
                ))}
              </div>
            </div>
          </div>
        )}
      </main>

      <footer className="border-t border-border">
        <div className="mx-auto flex max-w-[1400px] flex-col gap-1 px-4 py-6 text-sm text-muted-foreground md:px-6 lg:flex-row lg:justify-between">
          <p>
            The top {OVERALL_CUTOFF} overall and the top {SECTION_CUTOFF} of each section, listed by
            section and class number.
          </p>
          <p>Tied students share a rank, marked T. Ties at a cutoff are all listed.</p>
        </div>
      </footer>
    </div>
  );
}
