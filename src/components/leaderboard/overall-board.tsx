import type { BoardEntry } from "@/lib/leaderboard";
import { BoardRow, tiedRanks } from "./board-row";

export function OverallBoard({ entries }: { entries: BoardEntry[] }) {
  const tied = tiedRanks(entries);
  return (
    <section aria-labelledby="overall-heading" className="rounded-2xl border border-border bg-surface">
      <header className="flex items-baseline justify-between gap-4 border-b border-border px-4 py-4 lg:px-5">
        <h2 id="overall-heading" className="text-lg font-semibold tracking-tight lg:text-xl">
          Overall top 20
        </h2>
        <p className="text-sm text-muted-foreground">All six sections</p>
      </header>
      {entries.length === 0 ? (
        <EmptyBoard message="No points recorded yet. The board fills in as recitation points are awarded." />
      ) : (
        <ol className="divide-y divide-border py-1">
          {entries.map((e, i) => (
            <BoardRow
              key={`${e.section}-${e.classNumber}`}
              entry={e}
              index={i}
              tied={tied.has(e.rank)}
              showSection
              size="lg"
            />
          ))}
        </ol>
      )}
    </section>
  );
}

export function EmptyBoard({ message }: { message: string }) {
  return <p className="px-4 py-8 text-center text-sm text-muted-foreground lg:px-5">{message}</p>;
}
