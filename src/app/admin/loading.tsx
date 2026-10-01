// Skeleton of the admin roster, shown while it loads.
export default function AdminLoading() {
  return (
    <main className="flex flex-1 flex-col" aria-busy="true">
      <h1 className="sr-only">Points admin</h1>
      <p className="sr-only" role="status">
        Loading the roster
      </p>
      <div className="border-b border-border">
        <div className="mx-auto flex h-14 max-w-3xl items-center px-4">
          <div className="h-6 w-28 rounded-md bg-surface-sunken" />
        </div>
        <div className="mx-auto flex max-w-3xl gap-2 overflow-hidden px-4 pb-3">
          {Array.from({ length: 4 }, (_, i) => (
            <div key={i} className="h-11 w-28 shrink-0 rounded-lg bg-surface-sunken" />
          ))}
        </div>
      </div>
      <div className="mx-auto w-full max-w-3xl px-4 pt-5 motion-safe:animate-pulse">
        <div className="divide-y divide-border rounded-xl border border-border bg-surface">
          {Array.from({ length: 8 }, (_, i) => (
            <div key={i} className="flex min-h-[4.25rem] items-center gap-3 px-4">
              <div className="h-6 w-10 rounded-md bg-surface-sunken" />
              <div className="h-7 flex-1 rounded-md bg-surface-sunken" />
              <div className="h-12 w-[4.5rem] rounded-lg bg-surface-sunken" />
            </div>
          ))}
        </div>
      </div>
    </main>
  );
}
