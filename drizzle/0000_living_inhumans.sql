CREATE TABLE "admin_users" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"email" text NOT NULL,
	"password_hash" text NOT NULL,
	CONSTRAINT "admin_users_email_unique" UNIQUE("email")
);
--> statement-breakpoint
CREATE TABLE "blocks" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"page" text NOT NULL,
	"position" integer NOT NULL,
	"type" text NOT NULL,
	"size" text DEFAULT 'full' NOT NULL,
	"config" jsonb DEFAULT '{}'::jsonb NOT NULL,
	"created_at" timestamp with time zone DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE "login_attempts" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"ip_hash" text NOT NULL,
	"created_at" timestamp with time zone DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE "posts" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"slug" text NOT NULL,
	"title" jsonb DEFAULT '{}'::jsonb NOT NULL,
	"excerpt" jsonb DEFAULT '{}'::jsonb NOT NULL,
	"body" jsonb DEFAULT '{}'::jsonb NOT NULL,
	"cover_url" text,
	"tags" text[] DEFAULT '{}' NOT NULL,
	"published_at" timestamp with time zone,
	"draft" boolean DEFAULT true NOT NULL,
	"created_at" timestamp with time zone DEFAULT now() NOT NULL,
	"updated_at" timestamp with time zone DEFAULT now() NOT NULL,
	CONSTRAINT "posts_slug_unique" UNIQUE("slug")
);
--> statement-breakpoint
CREATE TABLE "project_images" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"project_id" uuid NOT NULL,
	"url" text NOT NULL,
	"alt" jsonb DEFAULT '{}'::jsonb NOT NULL,
	"position" integer NOT NULL
);
--> statement-breakpoint
CREATE TABLE "projects" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"slug" text NOT NULL,
	"title" jsonb DEFAULT '{}'::jsonb NOT NULL,
	"category" jsonb DEFAULT '{}'::jsonb NOT NULL,
	"summary" jsonb DEFAULT '{}'::jsonb NOT NULL,
	"body" jsonb DEFAULT '{}'::jsonb NOT NULL,
	"status" text NOT NULL,
	"started_at" text,
	"technologies" text[] DEFAULT '{}' NOT NULL,
	"link" text,
	"repo_url" text,
	"cover_image_id" uuid,
	"published" boolean DEFAULT true NOT NULL,
	"created_at" timestamp with time zone DEFAULT now() NOT NULL,
	CONSTRAINT "projects_slug_unique" UNIQUE("slug")
);
--> statement-breakpoint
CREATE TABLE "sessions" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"token_hash" text NOT NULL,
	"user_id" uuid NOT NULL,
	"expires_at" timestamp with time zone NOT NULL,
	CONSTRAINT "sessions_token_hash_unique" UNIQUE("token_hash")
);
--> statement-breakpoint
CREATE TABLE "settings" (
	"key" text PRIMARY KEY NOT NULL,
	"value" jsonb NOT NULL
);
--> statement-breakpoint
CREATE TABLE "skills" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"kind" text NOT NULL,
	"name" jsonb DEFAULT '{}'::jsonb NOT NULL,
	"level" jsonb DEFAULT '{}'::jsonb NOT NULL,
	"percentage" integer NOT NULL,
	"position" integer NOT NULL
);
--> statement-breakpoint
ALTER TABLE "project_images" ADD CONSTRAINT "project_images_project_id_projects_id_fk" FOREIGN KEY ("project_id") REFERENCES "public"."projects"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "sessions" ADD CONSTRAINT "sessions_user_id_admin_users_id_fk" FOREIGN KEY ("user_id") REFERENCES "public"."admin_users"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
CREATE INDEX "blocks_page_position_idx" ON "blocks" USING btree ("page","position");--> statement-breakpoint
CREATE INDEX "login_attempts_ip_hash_created_at_idx" ON "login_attempts" USING btree ("ip_hash","created_at");