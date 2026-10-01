import type { SectionBoard as SectionBoardData } from "@/lib/leaderboard";
import { BoardRow, tiedRanks } from "./board-row";
import { EmptyBoard } from "./overall-board";

export function sectionAnchor(name: string) {
  return `section-${name.toLowerCase()}`;
}

export function SectionBoard({ board, offset }: { board: SectionBoardData; offset: number }) {
  const tied = tiedRanks(board.entries);
  const headingId = `${sectionAnchor(board.section)}-heading`;
  return (
    <section
      id={sectionAnchor(board.section)}
      aria-labelledby={headingId}
      className="scroll-mt-20 rounded-xl border border-border bg-surface"
    >
      <header className="flex items-baseline justify-between gap-3 border-b border-border px-4 py-3">
        <h4 id={headingId} className="font-semibold tracking-tight lg:text-lg">
          {board.section}
        </h4>
        <p className="text-sm text-muted-foreground">{board.entries.length > 5 ? "Top 5, ties included" : "Top 5"}</p>
      </header>
      {board.entries.length === 0 ? (
        <EmptyBoard message="No points yet." />
      ) : (
        <ol className="divide-y divide-border py-1">
          {board.entries.map((e, i) => (
            <BoardRow
              key={e.classNumber}
              entry={e}
              index={offset + i}
              tied={tied.has(e.rank)}
              showSection={false}
            />
          ))}
        </ol>
      )}
    </section>
  );
}
