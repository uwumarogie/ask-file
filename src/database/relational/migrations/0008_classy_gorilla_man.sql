ALTER TABLE "files" DROP CONSTRAINT "files_user_id_user_user_id_fk";
--> statement-breakpoint
ALTER TABLE "files" DROP COLUMN "user_id";