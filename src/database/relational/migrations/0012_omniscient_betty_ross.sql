CREATE TABLE "chat" (
	"chat_id" varchar PRIMARY KEY NOT NULL,
	"user_id" varchar NOT NULL,
	"file_id" varchar NOT NULL,
	"title" varchar NOT NULL,
	"created_at" timestamp DEFAULT now() NOT NULL,
	"updated_at" timestamp DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE "message" (
	"message_id" varchar PRIMARY KEY NOT NULL,
	"chat_id" varchar NOT NULL,
	"user_id" varchar NOT NULL,
	"file_id" varchar NOT NULL,
	"content" varchar NOT NULL,
	"created_at" timestamp DEFAULT now() NOT NULL,
	"updated_at" timestamp DEFAULT now() NOT NULL
);
--> statement-breakpoint
ALTER TABLE "chat" ADD CONSTRAINT "chat_user_id_user_user_id_fk" FOREIGN KEY ("user_id") REFERENCES "public"."user"("user_id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "chat" ADD CONSTRAINT "chat_file_id_files_file_id_fk" FOREIGN KEY ("file_id") REFERENCES "public"."files"("file_id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "message" ADD CONSTRAINT "message_chat_id_chat_chat_id_fk" FOREIGN KEY ("chat_id") REFERENCES "public"."chat"("chat_id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "message" ADD CONSTRAINT "message_user_id_user_user_id_fk" FOREIGN KEY ("user_id") REFERENCES "public"."user"("user_id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "message" ADD CONSTRAINT "message_file_id_files_file_id_fk" FOREIGN KEY ("file_id") REFERENCES "public"."files"("file_id") ON DELETE no action ON UPDATE no action;