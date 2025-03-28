CREATE TYPE "public"."message_role" AS ENUM('system', 'user', 'assistant');--> statement-breakpoint
ALTER TABLE "user" RENAME TO "users";--> statement-breakpoint
ALTER TABLE "users" DROP CONSTRAINT "user_username_unique";--> statement-breakpoint
ALTER TABLE "users" DROP CONSTRAINT "user_email_unique";--> statement-breakpoint
ALTER TABLE "chat" DROP CONSTRAINT "chat_user_id_user_user_id_fk";
--> statement-breakpoint
ALTER TABLE "files" DROP CONSTRAINT "files_user_id_user_user_id_fk";
--> statement-breakpoint
ALTER TABLE "message" DROP CONSTRAINT "message_user_id_user_user_id_fk";
--> statement-breakpoint
ALTER TABLE "message" DROP CONSTRAINT "message_file_id_files_file_id_fk";
--> statement-breakpoint
ALTER TABLE "message" ADD COLUMN "message_role" "message_role";--> statement-breakpoint
ALTER TABLE "chat" ADD CONSTRAINT "chat_user_id_users_user_id_fk" FOREIGN KEY ("user_id") REFERENCES "public"."users"("user_id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "files" ADD CONSTRAINT "files_user_id_users_user_id_fk" FOREIGN KEY ("user_id") REFERENCES "public"."users"("user_id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "message" ADD CONSTRAINT "message_user_id_users_user_id_fk" FOREIGN KEY ("user_id") REFERENCES "public"."users"("user_id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "message" DROP COLUMN "file_id";--> statement-breakpoint
ALTER TABLE "users" ADD CONSTRAINT "users_username_unique" UNIQUE("username");--> statement-breakpoint
ALTER TABLE "users" ADD CONSTRAINT "users_email_unique" UNIQUE("email");