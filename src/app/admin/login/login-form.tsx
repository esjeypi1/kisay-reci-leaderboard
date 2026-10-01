"use client";

import { useActionState } from "react";
import { login, type LoginState } from "../actions";

export function LoginForm() {
  const [state, action, pending] = useActionState<LoginState, FormData>(login, {});
  return (
    <form action={action} className="mt-8 flex flex-col gap-4">
      <div className="flex flex-col gap-2">
        <label htmlFor="password" className="text-sm font-medium">
          Password
        </label>
        <input
          id="password"
          name="password"
          type="password"
          autoComplete="current-password"
          required
          aria-invalid={state.error ? true : undefined}
          aria-describedby={state.error ? "password-error" : undefined}
          className="h-12 rounded-lg border border-border-strong bg-surface px-3.5 text-base text-foreground outline-none transition-colors focus:border-accent focus-visible:outline-2 focus-visible:outline-offset-0 aria-invalid:border-danger"
        />
        {state.error && (
          <p id="password-error" role="alert" className="text-sm text-danger">
            {state.error}
          </p>
        )}
      </div>
      <button
        type="submit"
        disabled={pending}
        className="h-12 rounded-lg bg-accent font-semibold text-accent-foreground transition-[transform,opacity] active:scale-[0.98] disabled:opacity-60"
      >
        {pending ? "Logging in…" : "Log in"}
      </button>
    </form>
  );
}
