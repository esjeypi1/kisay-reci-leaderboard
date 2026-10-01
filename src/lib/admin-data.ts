import "server-only";
import { asc } from "drizzle-orm";
import { getDb } from "@/db";
import { sections, students } from "@/db/schema";
import { isAdmin } from "./session";

export type RosterStudent = {
  id: number;
  classNumber: string;
  sex: "B" | "G";
  number: number;
  points: number;
};

export type RosterSection = {
  slug: string;
  name: string;
  students: RosterStudent[];
};

/** Full roster with points. Admin only: refuses to run without a valid session. */
export async function getRoster(): Promise<RosterSection[]> {
  if (!(await isAdmin())) throw new Error("Unauthorized");
  const db = getDb();
  const [sectionRows, studentRows] = await Promise.all([
    db.select().from(sections).orderBy(asc(sections.sortOrder)),
    db
      .select({
        id: students.id,
        sectionId: students.sectionId,
        sex: students.sex,
        number: students.number,
        points: students.points,
      })
      .from(students)
      .orderBy(asc(students.sex), asc(students.number)),
  ]);

  return sectionRows.map((s) => ({
    slug: s.slug,
    name: s.name,
    students: studentRows
      .filter((st) => st.sectionId === s.id)
      .map((st) => ({
        id: st.id,
        classNumber: `${st.sex}${st.number}`,
        sex: st.sex,
        number: st.number,
        points: st.points,
      })),
  }));
}
