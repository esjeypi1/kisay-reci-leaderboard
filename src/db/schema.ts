import { sql } from "drizzle-orm";
import {
  check,
  index,
  integer,
  pgEnum,
  pgTable,
  serial,
  smallint,
  text,
  timestamp,
  unique,
} from "drizzle-orm/pg-core";

export const sexEnum = pgEnum("sex", ["B", "G"]);

export const sections = pgTable("sections", {
  id: serial("id").primaryKey(),
  slug: text("slug").notNull().unique(),
  name: text("name").notNull().unique(),
  gradeLevel: smallint("grade_level").notNull(),
  sortOrder: smallint("sort_order").notNull(),
});

export const students = pgTable(
  "students",
  {
    id: serial("id").primaryKey(),
    sectionId: integer("section_id")
      .notNull()
      .references(() => sections.id, { onDelete: "cascade" }),
    sex: sexEnum("sex").notNull(),
    number: smallint("number").notNull(),
    points: integer("points").notNull().default(0),
    updatedAt: timestamp("updated_at", { withTimezone: true })
      .notNull()
      .defaultNow(),
  },
  (t) => [
    unique("students_section_class_number_unique").on(
      t.sectionId,
      t.sex,
      t.number,
    ),
    check("students_points_nonnegative", sql`${t.points} >= 0`),
    check("students_number_positive", sql`${t.number} > 0`),
    index("students_points_idx").on(t.points),
  ],
);

// Failed admin logins per hashed client key, for rate limiting.
export const loginAttempts = pgTable("login_attempts", {
  key: text("key").primaryKey(),
  count: integer("count").notNull().default(0),
  windowStart: timestamp("window_start", { withTimezone: true })
    .notNull()
    .defaultNow(),
});
