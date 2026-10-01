CREATE TYPE "public"."sex" AS ENUM('B', 'G');--> statement-breakpoint
CREATE TABLE "login_attempts" (
	"key" text PRIMARY KEY NOT NULL,
	"count" integer DEFAULT 0 NOT NULL,
	"window_start" timestamp with time zone DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE "sections" (
	"id" serial PRIMARY KEY NOT NULL,
	"slug" text NOT NULL,
	"name" text NOT NULL,
	"grade_level" smallint NOT NULL,
	"sort_order" smallint NOT NULL,
	CONSTRAINT "sections_slug_unique" UNIQUE("slug"),
	CONSTRAINT "sections_name_unique" UNIQUE("name")
);
--> statement-breakpoint
CREATE TABLE "students" (
	"id" serial PRIMARY KEY NOT NULL,
	"section_id" integer NOT NULL,
	"sex" "sex" NOT NULL,
	"number" smallint NOT NULL,
	"points" integer DEFAULT 0 NOT NULL,
	"updated_at" timestamp with time zone DEFAULT now() NOT NULL,
	CONSTRAINT "students_section_class_number_unique" UNIQUE("section_id","sex","number"),
	CONSTRAINT "students_points_nonnegative" CHECK ("students"."points" >= 0),
	CONSTRAINT "students_number_positive" CHECK ("students"."number" > 0)
);
--> statement-breakpoint
ALTER TABLE "students" ADD CONSTRAINT "students_section_id_sections_id_fk" FOREIGN KEY ("section_id") REFERENCES "public"."sections"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
CREATE INDEX "students_points_idx" ON "students" USING btree ("points");