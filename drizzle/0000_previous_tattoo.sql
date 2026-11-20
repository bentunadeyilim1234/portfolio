CREATE TABLE "adminUsers" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"email" text NOT NULL,
	"passwordHash" text NOT NULL,
	CONSTRAINT "adminUsers_email_unique" UNIQUE("email")
);
--> statement-breakpoint
CREATE TABLE "blocks" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"page" text NOT NULL,
	"position" integer NOT NULL,
	"type" text NOT NULL,
	"size" text DEFAULT 'full' NOT NULL,
	"config" jsonb DEFAULT '{}'::jsonb NOT NULL,
	"createdAt" timestamp with time zone DEFAULT now()
);
--> statement-breakpoint
CREATE TABLE "loginAttempts" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"ipHash" text NOT NULL,
	"createdAt" timestamp with time zone DEFAULT now()
);
--> statement-breakpoint
CREATE TABLE "posts" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"slug" text,
	"title" jsonb DEFAULT '{}'::jsonb NOT NULL,
	"excerpt" jsonb DEFAULT '{}'::jsonb NOT NULL,
	"body" jsonb DEFAULT '{}'::jsonb NOT NULL,
	"coverUrl" text,
	"tags" text[] DEFAULT '{}',
	"publishedAt" timestamp with time zone,
	"draft" boolean DEFAULT true NOT NULL,
	"createdAt" timestamp with time zone DEFAULT now(),
	"updatedAt" timestamp with time zone DEFAULT now(),
	CONSTRAINT "posts_slug_unique" UNIQUE("slug")
);
--> statement-breakpoint
CREATE TABLE "projectImages" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"projectId" uuid NOT NULL,
	"url" text NOT NULL,
	"alt" jsonb DEFAULT '{}'::jsonb,
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
	"startedAt" text,
	"technologies" text[] DEFAULT '{}' NOT NULL,
	"link" text,
	"repoUrl" text,
	"coverImageId" uuid,
	"published" boolean DEFAULT true NOT NULL,
	"createdAt" timestamp with time zone DEFAULT now(),
	CONSTRAINT "projects_slug_unique" UNIQUE("slug")
);
--> statement-breakpoint
CREATE TABLE "sessions" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"tokenHash" text NOT NULL,
	"userId" uuid,
	"expiresAt" timestamp with time zone NOT NULL,
	CONSTRAINT "sessions_tokenHash_unique" UNIQUE("tokenHash")
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
ALTER TABLE "projectImages" ADD CONSTRAINT "projectImages_projectId_projects_id_fk" FOREIGN KEY ("projectId") REFERENCES "public"."projects"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "sessions" ADD CONSTRAINT "sessions_userId_adminUsers_id_fk" FOREIGN KEY ("userId") REFERENCES "public"."adminUsers"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
CREATE INDEX "blocks_page_position_idx" ON "blocks" USING btree ("page","position");--> statement-breakpoint
CREATE INDEX "loginAttempts_ipHash_createdAt_idx" ON "loginAttempts" USING btree ("ipHash","createdAt");