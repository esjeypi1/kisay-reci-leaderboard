import "server-only";
import { sql } from "drizzle-orm";
import { connection } from "next/server";
import { getDb } from "@/db";

export const OVERALL_CUTOFF = 20;
export const SECTION_CUTOFF = 5;

export type BoardEntry = {
  rank: number;
  section: string;
  classNumber: string;
  points: number;
};

export type SectionBoard = {
  section: string;
  gradeLevel: number;
  entries: BoardEntry[];
};

export type Leaderboard = {
  overall: BoardEntry[];
  sections: SectionBoard[];
};

type RankedRow = {
  section: string;
  sort_order: number;
  sex: "B" | "G";
  number: number;
  points: number;
  overall_rank: number;
  section_rank: number;
};

/**
 * Ranks on the server and returns ONLY students inside a public cutoff:
 * top 20 overall or top 5 in their section (competition ranking, so ties at the
 * cutoff are all included). Students with 0 points are never returned.
 * Nothing else about the roster leaves this function.
 */
export async function getLeaderboard(): Promise<Leaderboard> {
  await connection();
  const db = getDb();

  const [rows, sectionRows] = await Promise.all([
    db.execute<RankedRow>(sql`
      with ranked as (
        select
          se.name as section,
          se.sort_order,
          st.sex,
          st.number,
          st.points,
          rank() over (order by st.points desc)::int as overall_rank,
          rank() over (partition by st.section_id order by st.points desc)::int as section_rank
        from students st
        join sections se on se.id = st.section_id
        where st.points > 0
      )
      select section, sort_order, sex, number, points, overall_rank, section_rank
      from ranked
      where overall_rank <= ${OVERALL_CUTOFF} or section_rank <= ${SECTION_CUTOFF}
      order by points desc, sort_order, sex, number
    `),
    db.execute<{ name: string; grade_level: number }>(
      sql`select name, grade_level from sections order by sort_order`,
    ),
  ]);

  const toEntry = (r: RankedRow, rank: number): BoardEntry => ({
    rank,
    section: r.section,
    classNumber: `${r.sex}${r.number}`,
    points: r.points,
  });

  const overall = rows
    .filter((r) => r.overall_rank <= OVERALL_CUTOFF)
    .map((r) => toEntry(r, r.overall_rank));

  const sections = sectionRows.map((s) => ({
    section: s.name,
    gradeLevel: s.grade_level,
    entries: rows
      .filter((r) => r.section === s.name && r.section_rank <= SECTION_CUTOFF)
      .map((r) => toEntry(r, r.section_rank)),
  }));

  return { overall, sections };
}
