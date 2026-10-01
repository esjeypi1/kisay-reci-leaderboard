"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import { ArrowUpRight, Minus, PencilSimple, Plus, SignOut } from "@phosphor-icons/react";
import { AnimatePresence } from "motion/react";
import { Sheet, SheetContent, SheetDescription, SheetTitle } from "@/components/lightswind/sheet";
import { Toast, ToastViewport } from "@/components/lightswind/toast";
import type { RosterSection, RosterStudent } from "@/lib/admin-data";
import { MAX_DELTA, MAX_POINTS } from "@/lib/points";
import { cn } from "@/lib/utils";
import { adjustPoints, logout, setPoints, type PointsResult } from "./actions";

type ToastItem = { id: number; variant: "error" | "success"; message: string; loginLink?: boolean };

const SESSION_EXPIRED = "Your session expired. Log in again.";

function parseWhole(value: string): number | null {
  const trimmed = value.trim();
  if (!/^\d+$/.test(trimmed)) return null;
  const n = Number(trimmed);
  return Number.isSafeInteger(n) ? n : null;
}

export function AdminBoard({ roster, initialSlug }: { roster: RosterSection[]; initialSlug: string }) {
  const [slug, setSlug] = useState(initialSlug);
  const [points, setPointsState] = useState<Record<number, number>>(() =>
    Object.fromEntries(roster.flatMap((s) => s.students.map((st) => [st.id, st.points]))),
  );
  const [changed, setChanged] = useState<Record<number, number>>({});
  const [editing, setEditing] = useState<RosterStudent | null>(null);
  const [toasts, setToasts] = useState<ToastItem[]>([]);
  const [announcement, setAnnouncement] = useState("");
  const chipList = useRef<HTMLUListElement>(null);
  const pending = useRef<Record<number, number>>({});
  const toastId = useRef(0);

  const section = roster.find((s) => s.slug === slug) ?? roster[0];

  const toast = useCallback((variant: ToastItem["variant"], message: string) => {
    const id = ++toastId.current;
    setToasts((t) => [...t.slice(-2), { id, variant, message, loginLink: message === SESSION_EXPIRED }]);
    setTimeout(() => setToasts((t) => t.filter((x) => x.id !== id)), variant === "error" ? 6000 : 3500);
  }, []);

  const markChanged = (id: number) => setChanged((c) => ({ ...c, [id]: (c[id] ?? 0) + 1 }));

  /**
   * Optimistic update: `apply` changes the shown value now, `undo` reverses just this
   * change if the server refuses it. The server's value wins once no request for this
   * student is still in flight.
   */
  const run = useCallback(
    async (
      id: number,
      apply: (current: number) => number,
      undo: (current: number) => number,
      request: () => Promise<PointsResult>,
    ) => {
      setPointsState((p) => ({ ...p, [id]: apply(p[id]) }));
      markChanged(id);
      pending.current[id] = (pending.current[id] ?? 0) + 1;

      let result: PointsResult;
      try {
        result = await request();
      } catch {
        result = { ok: false, error: "Couldn't reach the server. Check your connection and try again." };
      }
      pending.current[id] -= 1;

      if (result.ok) {
        if (pending.current[id] === 0) setPointsState((p) => ({ ...p, [id]: result.points }));
        const student = roster.flatMap((s) => s.students).find((s) => s.id === id);
        if (student) setAnnouncement(`${student.classNumber}: ${result.points} points`);
      } else {
        setPointsState((p) => ({ ...p, [id]: undo(p[id]) }));
        toast("error", result.error);
      }
      return result;
    },
    [toast, roster],
  );

  // Keep the current section's chip visible (also on a ?s= deep link).
  useEffect(() => {
    chipList.current
      ?.querySelector<HTMLElement>('[aria-current="true"]')
      ?.scrollIntoView({ inline: "center", block: "nearest" });
  }, [slug]);

  const adjust = (student: RosterStudent, delta: number) => {
    if ((points[student.id] ?? 0) + delta < 0) {
      toast("error", `${student.classNumber} already has 0 points.`);
      return;
    }
    void run(student.id, (p) => p + delta, (p) => p - delta, () => adjustPoints(student.id, delta));
  };

  const switchSection = (next: string) => {
    setSlug(next);
    window.history.replaceState(null, "", `?s=${next}`);
    window.scrollTo({ top: 0 });
  };

  const boys = section?.students.filter((s) => s.sex === "B") ?? [];
  const girls = section?.students.filter((s) => s.sex === "G") ?? [];
  const sectionTotal = section?.students.reduce((sum, s) => sum + (points[s.id] ?? 0), 0) ?? 0;

  return (
    <div className="flex flex-1 flex-col">
      <header className="sticky top-0 z-30 border-b border-border bg-background">
        <div className="mx-auto flex min-h-14 max-w-3xl flex-wrap items-center justify-between gap-x-2 px-4">
          <h1 className="min-w-0 truncate">
            <span className="sr-only">Points admin: </span>
            <span className="text-lg font-semibold tracking-tight">{section?.name}</span>
          </h1>
          <div className="flex flex-wrap items-center gap-1">
            <a
              href="/"
              target="_blank"
              rel="noreferrer"
              className="inline-flex h-11 items-center gap-1.5 rounded-lg px-3 text-sm font-medium text-muted-foreground hover:bg-surface-sunken hover:text-foreground"
            >
              Leaderboard
              <ArrowUpRight size={14} weight="bold" aria-hidden="true" />
              <span className="sr-only">(opens in a new tab)</span>
            </a>
            <form action={logout}>
              <button
                type="submit"
                className="inline-flex h-11 items-center gap-1.5 rounded-lg px-3 text-sm font-medium text-muted-foreground hover:bg-surface-sunken hover:text-foreground"
              >
                <SignOut size={16} weight="bold" aria-hidden="true" />
                Log out
              </button>
            </form>
          </div>
        </div>
        <nav aria-label="Sections" className="mx-auto max-w-3xl">
          <ul ref={chipList} className="flex snap-x scroll-px-4 gap-2 overflow-x-auto px-4 pb-3 [scrollbar-width:none]">
            {roster.map((s) => {
              const active = s.slug === section?.slug;
              return (
                <li key={s.slug} className="snap-start">
                  <button
                    type="button"
                    onClick={() => switchSection(s.slug)}
                    aria-current={active ? "true" : undefined}
                    className={cn(
                      "h-11 whitespace-nowrap rounded-lg border px-4 text-sm font-semibold transition-colors active:scale-[0.98]",
                      active
                        ? "border-accent bg-accent text-accent-foreground"
                        : "border-border bg-surface text-foreground hover:border-border-strong",
                    )}
                  >
                    {s.name}
                  </button>
                </li>
              );
            })}
          </ul>
        </nav>
      </header>

      <main className="mx-auto w-full max-w-3xl flex-1 px-4 pb-28 pt-5">
        {section && (
          <>
            <div className="flex items-center justify-between gap-4">
              <p className="text-sm text-muted-foreground">
                {section.students.length} students ·{" "}
                <span className="font-mono tabular-nums">{sectionTotal}</span> pts total
              </p>
              {girls.length > 0 && (
                <a
                  href="#girls"
                  className="inline-flex h-11 shrink-0 items-center whitespace-nowrap rounded-lg px-3 text-sm font-medium text-accent hover:bg-accent-soft"
                >
                  Go to girls
                </a>
              )}
            </div>
            <RosterGroup
              title="Boys"
              id="boys"
              students={boys}
              points={points}
              changed={changed}
              onAdjust={adjust}
              onEdit={setEditing}
            />
            <RosterGroup
              title="Girls"
              id="girls"
              students={girls}
              points={points}
              changed={changed}
              onAdjust={adjust}
              onEdit={setEditing}
            />
          </>
        )}
      </main>

      <EditSheet
        student={editing}
        sectionName={section?.name ?? ""}
        currentPoints={editing ? (points[editing.id] ?? 0) : 0}
        onClose={() => setEditing(null)}
        onAdd={async (student, amount) => {
          const r = await run(student.id, (p) => p + amount, (p) => p - amount, () => adjustPoints(student.id, amount));
          if (r.ok) toast("success", `Added ${amount} to ${student.classNumber}. New total: ${r.points}.`);
          return r.ok;
        }}
        onSet={async (student, total) => {
          const previous = points[student.id] ?? 0;
          const r = await run(student.id, () => total, () => previous, () => setPoints(student.id, total));
          if (r.ok) toast("success", `${student.classNumber} total set to ${r.points}.`);
          return r.ok;
        }}
      />

      <ToastViewport aria-live="polite">
        <AnimatePresence initial={false}>
          {toasts.map((t) => (
            <Toast
              key={t.id}
              variant={t.variant}
              onClose={() => setToasts((all) => all.filter((x) => x.id !== t.id))}
            >
              {t.message}
              {t.loginLink && (
                <>
                  {" "}
                  <a href="/admin/login" className="font-semibold text-accent underline underline-offset-2">
                    Log in
                  </a>
                </>
              )}
            </Toast>
          ))}
        </AnimatePresence>
      </ToastViewport>
      <p className="sr-only" role="status" aria-live="polite">
        {announcement}
      </p>
    </div>
  );
}

function RosterGroup({
  title,
  id,
  students,
  points,
  changed,
  onAdjust,
  onEdit,
}: {
  title: string;
  id: string;
  students: RosterStudent[];
  points: Record<number, number>;
  changed: Record<number, number>;
  onAdjust: (s: RosterStudent, delta: number) => void;
  onEdit: (s: RosterStudent) => void;
}) {
  if (students.length === 0) return null;
  return (
    <section id={id} aria-label={title} className="mt-6 scroll-mt-32">
      <h2 className="mb-2 text-sm font-semibold text-muted-foreground">{title}</h2>
      <ul className="divide-y divide-border rounded-xl border border-border bg-surface">
        {students.map((s) => {
          const value = points[s.id] ?? 0;
          return (
            <li key={s.id} className="flex min-h-[4.25rem] flex-wrap items-center gap-x-2 gap-y-1 py-2 pl-4 pr-2">
              <span className="w-12 shrink-0 font-mono text-lg font-semibold">{s.classNumber}</span>
              <span className="flex flex-1 items-baseline gap-1">
                <span
                  key={changed[s.id] ?? 0}
                  className={cn("font-mono text-2xl font-semibold tabular-nums", changed[s.id] && "points-flash")}
                >
                  {value}
                </span>
                <span className="text-xs text-muted-foreground">pts</span>
              </span>
              <div className="ml-auto flex flex-wrap items-center justify-end gap-2">
                <button
                  type="button"
                  onClick={() => onEdit(s)}
                  aria-label={`Edit ${s.classNumber}`}
                  className="grid size-12 place-items-center rounded-lg text-muted-foreground transition-colors hover:bg-surface-sunken hover:text-foreground active:scale-95"
                >
                  <PencilSimple size={20} weight="bold" aria-hidden="true" />
                </button>
                <button
                  type="button"
                  onClick={() => onAdjust(s, -1)}
                  disabled={value === 0}
                  aria-label={`Remove 1 point from ${s.classNumber}`}
                  className="inline-flex h-12 w-14 items-center justify-center gap-0.5 rounded-lg border border-border-strong font-mono text-lg font-semibold text-foreground transition-[transform,opacity] active:scale-95 disabled:opacity-35"
                >
                  <Minus size={16} weight="bold" aria-hidden="true" />1
                </button>
                <button
                  type="button"
                  onClick={() => onAdjust(s, 1)}
                  aria-label={`Add 1 point to ${s.classNumber}`}
                  className="inline-flex h-12 w-[4.5rem] items-center justify-center gap-0.5 rounded-lg bg-accent font-mono text-lg font-semibold text-accent-foreground transition-transform active:scale-95"
                >
                  <Plus size={18} weight="bold" aria-hidden="true" />1
                </button>
              </div>
            </li>
          );
        })}
      </ul>
    </section>
  );
}

function EditSheet({
  student,
  sectionName,
  currentPoints,
  onClose,
  onAdd,
  onSet,
}: {
  student: RosterStudent | null;
  sectionName: string;
  currentPoints: number;
  onClose: () => void;
  onAdd: (s: RosterStudent, amount: number) => Promise<boolean>;
  onSet: (s: RosterStudent, total: number) => Promise<boolean>;
}) {
  const addRef = useRef<HTMLInputElement>(null);
  return (
    <Sheet open={student !== null} onOpenChange={(open) => !open && onClose()}>
      <SheetContent side="bottom" initialFocus={addRef} className="mx-auto max-w-lg sm:bottom-4 sm:rounded-xl sm:border">
        {student && (
          <EditForms
            key={student.id}
            student={student}
            sectionName={sectionName}
            currentPoints={currentPoints}
            addRef={addRef}
            onAdd={async (n) => (await onAdd(student, n)) && onClose()}
            onSet={async (n) => (await onSet(student, n)) && onClose()}
          />
        )}
      </SheetContent>
    </Sheet>
  );
}

function EditForms({
  student,
  sectionName,
  currentPoints,
  addRef,
  onAdd,
  onSet,
}: {
  student: RosterStudent;
  sectionName: string;
  currentPoints: number;
  addRef: React.RefObject<HTMLInputElement | null>;
  onAdd: (n: number) => Promise<unknown>;
  onSet: (n: number) => Promise<unknown>;
}) {
  const [addValue, setAddValue] = useState("");
  const [setValue, setSetValue] = useState(String(currentPoints));
  const [addError, setAddError] = useState<string | null>(null);
  const [setError, setSetError] = useState<string | null>(null);
  const [busy, setBusy] = useState(false);

  const submitAdd = async (e: React.FormEvent) => {
    e.preventDefault();
    const n = parseWhole(addValue);
    if (n === null || n < 1 || n > MAX_DELTA) {
      setAddError(`Enter a whole number from 1 to ${MAX_DELTA}.`);
      return;
    }
    setAddError(null);
    setBusy(true);
    await onAdd(n);
    setBusy(false);
  };

  const submitSet = async (e: React.FormEvent) => {
    e.preventDefault();
    const n = parseWhole(setValue);
    if (n === null || n > MAX_POINTS) {
      setSetError(`Enter a whole number from 0 to ${MAX_POINTS.toLocaleString("en-US")}.`);
      return;
    }
    setSetError(null);
    setBusy(true);
    await onSet(n);
    setBusy(false);
  };

  const inputClass =
    "h-12 min-w-0 flex-1 rounded-lg border border-border-strong bg-background px-3.5 font-mono text-lg tabular-nums text-foreground outline-none placeholder:font-sans placeholder:text-base placeholder:text-faint-foreground focus:border-accent focus-visible:outline-offset-0 aria-invalid:border-danger";

  return (
    <div className="px-5 pt-5">
      <SheetTitle className="pr-12">
        {sectionName} · <span className="font-mono">{student.classNumber}</span>
      </SheetTitle>
      <SheetDescription className="mt-1">
        Current total: <span className="font-mono font-semibold text-foreground">{currentPoints}</span> pts
      </SheetDescription>

      <form onSubmit={submitAdd} noValidate className="mt-6 flex flex-col gap-2">
        <label htmlFor="add-points" className="text-sm font-medium">
          Add points
        </label>
        <div className="flex gap-2">
          <input
            ref={addRef}
            id="add-points"
            inputMode="numeric"
            pattern="[0-9]*"
            enterKeyHint="done"
            autoComplete="off"
            placeholder="e.g. 5"
            value={addValue}
            onChange={(e) => setAddValue(e.target.value)}
            aria-invalid={addError ? true : undefined}
            aria-describedby={addError ? "add-error" : undefined}
            className={inputClass}
          />
          <button
            type="submit"
            disabled={busy}
            className="h-12 shrink-0 rounded-lg bg-accent px-5 font-semibold text-accent-foreground active:scale-[0.98] disabled:opacity-60"
          >
            Add
          </button>
        </div>
        {addError && (
          <p id="add-error" role="alert" className="text-sm text-danger">
            {addError}
          </p>
        )}
      </form>

      <form onSubmit={submitSet} noValidate className="mt-6 flex flex-col gap-2 border-t border-border pt-6">
        <label htmlFor="set-points" className="text-sm font-medium">
          Set total
        </label>
        <div className="flex gap-2">
          <input
            id="set-points"
            inputMode="numeric"
            pattern="[0-9]*"
            enterKeyHint="done"
            autoComplete="off"
            value={setValue}
            onChange={(e) => setSetValue(e.target.value)}
            aria-invalid={setError ? true : undefined}
            aria-describedby={setError ? "set-error" : "set-help"}
            className={inputClass}
          />
          <button
            type="submit"
            disabled={busy}
            className="h-12 shrink-0 rounded-lg border border-border-strong px-5 font-semibold text-foreground active:scale-[0.98] disabled:opacity-60"
          >
            Save total
          </button>
        </div>
        {setError ? (
          <p id="set-error" role="alert" className="text-sm text-danger">
            {setError}
          </p>
        ) : (
          <p id="set-help" className="text-sm text-muted-foreground">
            {parseWhole(setValue) !== null && parseWhole(setValue) !== currentPoints
              ? `Changes the total from ${currentPoints} to ${parseWhole(setValue)}.`
              : "Replaces the current total. Use this to correct mistakes."}
          </p>
        )}
      </form>
    </div>
  );
}
