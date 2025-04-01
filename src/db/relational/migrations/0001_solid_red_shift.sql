ALTER TABLE "user" RENAME TO "users";--> statement-breakpoint
ALTER TABLE "users" DROP CONSTRAINT "user_username_unique";--> statement-breakpoint
ALTER TABLE "users" DROP CONSTRAINT "user_email_unique";--> statement-breakpoint
ALTER TABLE "conversation" DROP CONSTRAINT "conversation_user_id_user_user_id_fk";
--> statement-breakpoint
ALTER TABLE "file" DROP CONSTRAINT "file_user_id_user_user_id_fk";
--> statement-breakpoint
ALTER TABLE "message" DROP CONSTRAINT "message_user_id_user_user_id_fk";
--> statement-breakpoint
ALTER TABLE "conversation" ADD CONSTRAINT "conversation_user_id_users_user_id_fk" FOREIGN KEY ("user_id") REFERENCES "public"."users"("user_id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "file" ADD CONSTRAINT "file_user_id_users_user_id_fk" FOREIGN KEY ("user_id") REFERENCES "public"."users"("user_id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "message" ADD CONSTRAINT "message_user_id_users_user_id_fk" FOREIGN KEY ("user_id") REFERENCES "public"."users"("user_id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "users" ADD CONSTRAINT "users_username_unique" UNIQUE("username");--> statement-breakpoint
ALTER TABLE "users" ADD CONSTRAINT "users_email_unique" UNIQUE("email");