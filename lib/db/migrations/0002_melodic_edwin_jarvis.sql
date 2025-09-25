DROP TABLE "reviews" CASCADE;--> statement-breakpoint
ALTER TABLE "instructors" DROP COLUMN "rating";--> statement-breakpoint
ALTER TABLE "instructors" DROP COLUMN "total_reviews";--> statement-breakpoint
ALTER TABLE "lessons" DROP COLUMN "rating";