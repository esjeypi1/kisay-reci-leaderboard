// Skeleton of the public leaderboard, shown while the standings load.
function SkeletonBoard({ rows, className = "" }: { rows: number; className?: string }) {
  return (
    <div className={`rounded-xl border border-border bg-surface ${className}`}>
      <div className="border-b border-border px-4 py-4">
        <div className="h-5 w-32 rounded-md bg-surface-sunken" />
      </div>
      <div className="divide-y divide-border py-1">
        {Array.from({ length: rows }, (_, i) => (
          <div key={i} className="flex min-h-12 items-center gap-3 px-4">
            <div className="h-7 w-10 rounded-lg bg-surface-sunken" />
            <div className="h-4 flex-1 rounded-md bg-surface-sunken" />
            <div className="h-4 w-12 rounded-md bg-surface-sunken" />
          </div>
        ))}
      </div>
    </div>
  );
}

export default function Loading() {
  return (
    <main className="flex flex-1 flex-col" aria-busy="true">
      <h1 className="sr-only">Recitation Points</h1>
      <p className="sr-only" role="status">
        Loading the leaderboard
      </p>
      <div className="mx-auto w-full max-w-[1400px] px-4 pb-6 pt-8 md:px-6 lg:pb-8 lg:pt-10">
        <div className="h-9 w-64 rounded-lg bg-surface-sunken lg:h-12 lg:w-96" />
        <div className="mt-3 h-6 w-48 rounded-md bg-surface-sunken" />
      </div>
      <div className="mx-auto grid w-full max-w-[1400px] grid-cols-1 gap-6 px-4 pb-12 motion-safe:animate-pulse md:px-6 lg:grid-cols-12 lg:gap-8">
        <SkeletonBoard rows={10} className="lg:col-span-5" />
        <div className="grid grid-cols-1 items-start gap-4 sm:grid-cols-2 lg:col-span-7 lg:gap-5">
          {Array.from({ length: 6 }, (_, i) => (
            <SkeletonBoard key={i} rows={5} />
          ))}
        </div>
      </div>
    </main>
  );
}
