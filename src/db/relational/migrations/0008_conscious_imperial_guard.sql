ALTER TABLE "authenticator" RENAME COLUMN "userId" TO "user_id";--> statement-breakpoint
ALTER TABLE "authenticator" DROP CONSTRAINT "authenticator_userId_users_user_id_fk";
--> statement-breakpoint
ALTER TABLE "authenticator" ADD CONSTRAINT "authenticator_user_id_users_user_id_fk" FOREIGN KEY ("user_id") REFERENCES "public"."users"("user_id") ON DELETE cascade ON UPDATE no action;