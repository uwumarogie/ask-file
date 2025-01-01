ALTER TABLE "user" ALTER COLUMN "user_id" SET DATA TYPE varchar;--> statement-breakpoint
ALTER TABLE "user" ALTER COLUMN "user_id" DROP DEFAULT;--> statement-breakpoint
ALTER TABLE "user" ADD CONSTRAINT "user_user_id_unique" UNIQUE("user_id");