"use client";

import { useEffect } from "react";

export default function Error({ error, retry }: { error: Error & { digest?: string }; retry: () => void }) {
  useEffect(() => {
    console.error(error);
  }, [error]);

  return (
    <main className="flex flex-1 items-center justify-center px-4 py-16">
      <div className="max-w-md text-center">
        <h1 className="text-2xl font-semibold tracking-tight">This page couldn&apos;t load</h1>
        <p className="mt-2 text-muted-foreground">
          The points couldn&apos;t be loaded right now. Check your connection and try again.
        </p>
        <button
          type="button"
          onClick={() => retry()}
          className="mt-6 h-11 rounded-lg bg-accent px-5 font-semibold text-accent-foreground active:scale-[0.98]"
        >
          Try again
        </button>
      </div>
    </main>
  );
}
