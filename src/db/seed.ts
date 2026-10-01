// Idempotent seed: creates missing sections and students, never touches existing points.
// Pass --reset to set every student's points back to 0.
import { config } from "dotenv";
import { drizzle } from "drizzle-orm/postgres-js";
import { sql } from "drizzle-orm";
import postgres from "postgres";
import { ROSTER } from "./roster";
import { sections, students } from "./schema";

config({ path: [".env.local", ".env"], quiet: true });

async function main() {
  const url = process.env.DATABASE_URL;
  if (!url) throw new Error("DATABASE_URL is not set");
  const reset = process.argv.includes("--reset");

  const client = postgres(url, { prepare: false, max: 1 });
  const db = drizzle(client);

  try {
    await db.transaction(async (tx) => {
      for (const [i, s] of ROSTER.entries()) {
        const [section] = await tx
          .insert(sections)
          .values({ name: s.name, slug: s.slug, gradeLevel: s.gradeLevel, sortOrder: i })
          .onConflictDoUpdate({
            target: sections.slug,
            set: { name: s.name, gradeLevel: s.gradeLevel, sortOrder: i },
          })
          .returning({ id: sections.id });

        const rows = [
          ...Array.from({ length: s.boys }, (_, n) => ({ sex: "B" as const, number: n + 1 })),
          ...Array.from({ length: s.girls }, (_, n) => ({ sex: "G" as const, number: n + 1 })),
        ].map((r) => ({ ...r, sectionId: section.id }));

        const inserted = await tx
          .insert(students)
          .values(rows)
          .onConflictDoNothing()
          .returning({ id: students.id });

        console.log(`${s.name}: ${rows.length} on roster, ${inserted.length} added`);
      }

      if (reset) {
        await tx.update(students).set({ points: 0, updatedAt: sql`now()` });
        console.log("--reset: all points set to 0");
      }
    });

    const [{ count }] = await db.execute<{ count: number }>(
      sql`select count(*)::int as count from students`,
    );
    console.log(`Done. ${count} students in the database.`);
  } finally {
    await client.end();
  }
}

main().catch((err) => {
  console.error(err);
  process.exit(1);
});
