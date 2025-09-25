CREATE TABLE "course_purchases" (
	"id" serial PRIMARY KEY NOT NULL,
	"course_id" integer NOT NULL,
	"student_name" varchar(100) NOT NULL,
	"student_email" varchar(255),
	"location" varchar(100),
	"purchase_amount" numeric(8, 2) NOT NULL,
	"is_real_purchase" boolean DEFAULT true NOT NULL,
	"created_at" timestamp DEFAULT now() NOT NULL,
	"metadata" json
);
--> statement-breakpoint
ALTER TABLE "course_purchases" ADD CONSTRAINT "course_purchases_course_id_courses_id_fk" FOREIGN KEY ("course_id") REFERENCES "public"."courses"("id") ON DELETE no action ON UPDATE no action;