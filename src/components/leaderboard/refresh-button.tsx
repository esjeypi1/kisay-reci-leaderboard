"use client";

import { useTransition } from "react";
import { useRouter } from "next/navigation";
import { ArrowClockwise } from "@phosphor-icons/react";

/** Re-fetches the leaderboard without a full reload; changed points animate in place. */
export function RefreshButton() {
  const router = useRouter();
  const [pending, startTransition] = useTransition();
  return (
    <button
      type="button"
      onClick={() => startTransition(() => router.refresh())}
      disabled={pending}
      className="inline-flex h-11 items-center gap-2 rounded-lg border border-border bg-surface px-3.5 text-sm font-medium text-foreground transition-[border-color,transform] hover:border-border-strong active:scale-[0.98] disabled:text-muted-foreground"
    >
      <ArrowClockwise
        size={16}
        weight="bold"
        aria-hidden="true"
        className={pending ? "motion-safe:animate-spin" : undefined}
      />
      {pending ? "Refreshing…" : "Refresh"}
    </button>
  );
}
