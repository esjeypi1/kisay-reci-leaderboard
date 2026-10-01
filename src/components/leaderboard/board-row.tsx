import { CountUp } from "@/components/lightswind/count-up";
import type { BoardEntry } from "@/lib/leaderboard";
import { cn } from "@/lib/utils";

const medal: Record<number, string> = {
  1: "bg-gold-soft text-gold",
  2: "bg-silver-soft text-silver",
  3: "bg-bronze-soft text-bronze",
};

export function RankChip({ rank, tied, size = "md" }: { rank: number; tied: boolean; size?: "md" | "lg" }) {
  return (
    <span
      className={cn(
        "inline-flex items-center justify-center rounded-md font-mono font-semibold tabular-nums",
        size === "lg" ? "h-8 min-w-11 px-1.5 text-[15px] lg:h-9 lg:min-w-12 lg:text-base" : "h-7 min-w-10 px-1.5 text-sm",
        medal[rank] ?? "bg-surface-sunken text-muted-foreground",
      )}
    >
      {tied && <span aria-hidden="true">T</span>}
      {rank}
      <span className="sr-only">{tied ? `, tied for rank ${rank}` : `, rank ${rank}`}</span>
    </span>
  );
}

/** Which ranks appear more than once in a board, i.e. are shared by a tie. */
export function tiedRanks(entries: BoardEntry[]): Set<number> {
  const seen = new Set<number>();
  const tied = new Set<number>();
  for (const e of entries) {
    if (seen.has(e.rank)) tied.add(e.rank);
    seen.add(e.rank);
  }
  return tied;
}

export function BoardRow({
  entry,
  index,
  tied,
  showSection,
  size = "md",
}: {
  entry: BoardEntry;
  index: number;
  tied: boolean;
  showSection: boolean;
  size?: "md" | "lg";
}) {
  const delay = index * 0.028 + 0.08;
  return (
    <li
      className={cn(
        "row-enter grid grid-cols-[auto_1fr_auto] items-center gap-3 px-4",
        size === "lg" ? "min-h-14 lg:min-h-15" : "min-h-12",
      )}
      style={{ "--i": index } as React.CSSProperties}
    >
      <RankChip rank={entry.rank} tied={tied} size={size} />
      <span className={cn("min-w-0 truncate", size === "lg" ? "text-base lg:text-lg" : "text-[15px]")}>
        {showSection && <span className="text-muted-foreground">{entry.section} · </span>}
        <span className="font-mono font-semibold">{entry.classNumber}</span>
      </span>
      <span className="flex items-baseline gap-1">
        <CountUp
          value={entry.points}
          delay={delay}
          className={cn("font-mono font-semibold", size === "lg" ? "text-lg lg:text-2xl" : "text-base")}
        />
        <span className="text-xs text-faint-foreground">pts</span>
      </span>
    </li>
  );
}
