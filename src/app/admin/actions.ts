"use server";

import { and, eq, gte, sql } from "drizzle-orm";
import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { getDb } from "@/db";
import { students } from "@/db/schema";
import {
  clearFailures,
  clientKey,
  lockedForMinutes,
  MAX_ATTEMPTS,
  recordFailure,
} from "@/lib/rate-limit";
import { MAX_DELTA, MAX_POINTS } from "@/lib/points";
import { checkPassword, createSession, destroySession, isAdmin } from "@/lib/session";


export type PointsResult =
  | { ok: true; id: number; points: number }
  | { ok: false; error: string };

export type LoginState = { error?: string };

function isId(value: unknown): value is number {
  return Number.isSafeInteger(value) && (value as number) > 0;
}

// Only the public page needs refreshing: the admin screen already shows the new total
// optimistically, and revalidating /admin would re-render the full roster on every tap.
function afterWrite() {
  revalidatePath("/");
}

export async function login(_prev: LoginState, formData: FormData): Promise<LoginState> {
  const password = formData.get("password");
  if (typeof password !== "string" || password.length === 0) {
    return { error: "Enter the admin password." };
  }

  const key = await clientKey();
  const locked = await lockedForMinutes(key);
  if (locked > 0) {
    return {
      error: `Too many attempts. Try again in ${locked} minute${locked === 1 ? "" : "s"}.`,
    };
  }

  if (!checkPassword(password)) {
    const count = await recordFailure(key);
    const left = MAX_ATTEMPTS - count;
    return {
      error:
        left > 0
          ? `Incorrect password. ${left} attempt${left === 1 ? "" : "s"} left.`
          : "Too many attempts. Try again in 15 minutes.",
    };
  }

  await clearFailures(key);
  await createSession();
  redirect("/admin");
}

export async function logout() {
  await destroySession();
  redirect("/admin/login");
}

/** Adds (or with a negative delta, removes) points. Never goes below 0. */
export async function adjustPoints(id: number, delta: number): Promise<PointsResult> {
  if (!(await isAdmin())) return { ok: false, error: "Your session expired. Log in again." };
  if (!isId(id)) return { ok: false, error: "Unknown student." };
  if (!Number.isSafeInteger(delta) || delta === 0 || Math.abs(delta) > MAX_DELTA) {
    return { ok: false, error: `Enter a whole number from 1 to ${MAX_DELTA}.` };
  }

  const [row] = await getDb()
    .update(students)
    .set({ points: sql`${students.points} + ${delta}`, updatedAt: sql`now()` })
    .where(
      and(
        eq(students.id, id),
        gte(sql`${students.points} + ${delta}`, 0),
        sql`${students.points} + ${delta} <= ${MAX_POINTS}`,
      ),
    )
    .returning({ id: students.id, points: students.points });

  if (!row) {
    return {
      ok: false,
      error: delta < 0 ? "Points can't go below 0." : "That would exceed the points limit.",
    };
  }
  afterWrite();
  return { ok: true, ...row };
}

/** Sets a student's total directly. */
export async function setPoints(id: number, points: number): Promise<PointsResult> {
  if (!(await isAdmin())) return { ok: false, error: "Your session expired. Log in again." };
  if (!isId(id)) return { ok: false, error: "Unknown student." };
  if (!Number.isSafeInteger(points) || points < 0 || points > MAX_POINTS) {
    return { ok: false, error: `Enter a whole number from 0 to ${MAX_POINTS.toLocaleString("en-US")}.` };
  }

  const [row] = await getDb()
    .update(students)
    .set({ points, updatedAt: sql`now()` })
    .where(eq(students.id, id))
    .returning({ id: students.id, points: students.points });

  if (!row) return { ok: false, error: "Unknown student." };
  afterWrite();
  return { ok: true, ...row };
}
