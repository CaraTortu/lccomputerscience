DO $$ BEGIN
 CREATE TYPE "public"."course_status" AS ENUM('active', 'archived', 'disabled', 'draft');
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
DO $$ BEGIN
 CREATE TYPE "public"."pricing_interval" AS ENUM('day', 'week', 'month', 'year');
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
DO $$ BEGIN
 CREATE TYPE "public"."pricing_type" AS ENUM('recurring', 'one_time');
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
DO $$ BEGIN
 CREATE TYPE "public"."product_tier" AS ENUM('bronze', 'silver', 'gold');
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
DO $$ BEGIN
 CREATE TYPE "public"."stripe_subscription_status" AS ENUM('trialing', 'active', 'past_due', 'canceled', 'incomplete', 'incomplete_expired', 'unpaid', 'paused');
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
DO $$ BEGIN
 CREATE TYPE "public"."user_tier" AS ENUM('free', 'bronze', 'silver', 'gold');
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
DO $$ BEGIN
 CREATE TYPE "public"."user_type" AS ENUM('user', 'admin');
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
CREATE TABLE IF NOT EXISTS "compsciguy_account" (
	"id" text PRIMARY KEY NOT NULL,
	"account_id" text NOT NULL,
	"provider_id" text NOT NULL,
	"user_id" text NOT NULL,
	"access_token" text,
	"refresh_token" text,
	"id_token" text,
	"access_token_expires_at" timestamp,
	"refresh_token_expires_at" timestamp,
	"scope" text,
	"password" text,
	"created_at" timestamp DEFAULT now() NOT NULL,
	"updated_at" timestamp DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE IF NOT EXISTS "compsciguy_courses" (
	"id" varchar(255) PRIMARY KEY NOT NULL,
	"name" varchar(255) NOT NULL,
	"description" text,
	"image" varchar(255) NOT NULL,
	"status" "course_status" DEFAULT 'active' NOT NULL,
	"created_at" timestamp DEFAULT now() NOT NULL,
	"updated_at" timestamp (3) DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE IF NOT EXISTS "compsciguy_lessons" (
	"id" varchar(255) PRIMARY KEY NOT NULL,
	"module_id" varchar(255) NOT NULL,
	"name" varchar(255) NOT NULL,
	"description" text,
	"content" text,
	"video_url" text,
	"presentation_url" text,
	"duration" integer NOT NULL,
	"created_at" timestamp DEFAULT now() NOT NULL,
	"updated_at" timestamp (3) DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE IF NOT EXISTS "compsciguy_modules" (
	"id" varchar(255) PRIMARY KEY NOT NULL,
	"course_id" varchar(255) NOT NULL,
	"name" varchar(255) NOT NULL,
	"description" text,
	"created_at" timestamp DEFAULT now() NOT NULL,
	"updated_at" timestamp (3) DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE IF NOT EXISTS "compsciguy_session" (
	"id" text PRIMARY KEY NOT NULL,
	"expires_at" timestamp NOT NULL,
	"token" text NOT NULL,
	"created_at" timestamp NOT NULL,
	"updated_at" timestamp NOT NULL,
	"ip_address" text,
	"user_agent" text,
	"user_id" text NOT NULL,
	"impersonated_by" text,
	CONSTRAINT "compsciguy_session_token_unique" UNIQUE("token")
);
--> statement-breakpoint
CREATE TABLE IF NOT EXISTS "compsciguy_stripe_customer" (
	"user_id" text NOT NULL,
	"stripe_customer_id" varchar(255) PRIMARY KEY NOT NULL,
	"billing_address" jsonb,
	"payment_method" jsonb
);
--> statement-breakpoint
CREATE TABLE IF NOT EXISTS "compsciguy_stripe_price" (
	"stripe_price_id" varchar(255) PRIMARY KEY NOT NULL,
	"stripe_product_id" varchar(255) NOT NULL,
	"active" boolean DEFAULT true NOT NULL,
	"description" text,
	"unit_amount" integer,
	"currency" varchar(3) NOT NULL,
	"type" "pricing_type" NOT NULL,
	"interval" "pricing_interval",
	"interval_count" integer,
	"trial_period_days" integer,
	"metadata" jsonb
);
--> statement-breakpoint
CREATE TABLE IF NOT EXISTS "compsciguy_stripe_product" (
	"stripe_product_id" varchar(255) PRIMARY KEY NOT NULL,
	"name" varchar(255) NOT NULL,
	"description" text,
	"tier" "product_tier" NOT NULL,
	"active" boolean DEFAULT true NOT NULL,
	"metadata" jsonb,
	CONSTRAINT "compsciguy_stripe_product_tier_unique" UNIQUE("tier")
);
--> statement-breakpoint
CREATE TABLE IF NOT EXISTS "compsciguy_stripe_subscription" (
	"stripe_subscription_id" varchar(255) PRIMARY KEY NOT NULL,
	"user_id" text NOT NULL,
	"subscription_status" "stripe_subscription_status" NOT NULL,
	"stripe_price_id" varchar(255) NOT NULL,
	"created" timestamp DEFAULT now() NOT NULL,
	"cancel_at_period_end" boolean DEFAULT false NOT NULL,
	"current_period_start" timestamp DEFAULT now() NOT NULL,
	"current_period_end" timestamp NOT NULL,
	"ended_at" timestamp,
	"cancel_at" timestamp,
	"canceled_at" timestamp,
	"trial_start" timestamp,
	"trial_end" timestamp,
	"metadata" jsonb
);
--> statement-breakpoint
CREATE TABLE IF NOT EXISTS "compsciguy_user" (
	"id" text PRIMARY KEY NOT NULL,
	"name" text NOT NULL,
	"email" text NOT NULL,
	"email_verified" boolean DEFAULT false NOT NULL,
	"image" text,
	"tier" "user_tier" DEFAULT 'free' NOT NULL,
	"role" text DEFAULT 'user' NOT NULL,
	"banned" boolean DEFAULT false,
	"ban_reason" text,
	"ban_expires" timestamp,
	"last_login_at" timestamp,
	"created_at" timestamp DEFAULT now() NOT NULL,
	"updated_at" timestamp DEFAULT now() NOT NULL,
	CONSTRAINT "compsciguy_user_email_unique" UNIQUE("email")
);
--> statement-breakpoint
CREATE TABLE IF NOT EXISTS "compsciguy_user_course_enrollments" (
	"user_id" text NOT NULL,
	"course_id" varchar(255) NOT NULL
);
--> statement-breakpoint
CREATE TABLE IF NOT EXISTS "compsciguy_user_lessons_complete" (
	"user_id" text NOT NULL,
	"lesson_id" varchar(255) NOT NULL
);
--> statement-breakpoint
CREATE TABLE IF NOT EXISTS "compsciguy_verification" (
	"id" text PRIMARY KEY NOT NULL,
	"identifier" text NOT NULL,
	"value" text NOT NULL,
	"expires_at" timestamp NOT NULL,
	"created_at" timestamp,
	"updated_at" timestamp
);
--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "compsciguy_account" ADD CONSTRAINT "compsciguy_account_user_id_compsciguy_user_id_fk" FOREIGN KEY ("user_id") REFERENCES "public"."compsciguy_user"("id") ON DELETE no action ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "compsciguy_lessons" ADD CONSTRAINT "compsciguy_lessons_module_id_compsciguy_modules_id_fk" FOREIGN KEY ("module_id") REFERENCES "public"."compsciguy_modules"("id") ON DELETE cascade ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "compsciguy_modules" ADD CONSTRAINT "compsciguy_modules_course_id_compsciguy_courses_id_fk" FOREIGN KEY ("course_id") REFERENCES "public"."compsciguy_courses"("id") ON DELETE cascade ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "compsciguy_session" ADD CONSTRAINT "compsciguy_session_user_id_compsciguy_user_id_fk" FOREIGN KEY ("user_id") REFERENCES "public"."compsciguy_user"("id") ON DELETE no action ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "compsciguy_stripe_customer" ADD CONSTRAINT "compsciguy_stripe_customer_user_id_compsciguy_user_id_fk" FOREIGN KEY ("user_id") REFERENCES "public"."compsciguy_user"("id") ON DELETE no action ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "compsciguy_stripe_price" ADD CONSTRAINT "compsciguy_stripe_price_stripe_product_id_compsciguy_stripe_product_stripe_product_id_fk" FOREIGN KEY ("stripe_product_id") REFERENCES "public"."compsciguy_stripe_product"("stripe_product_id") ON DELETE no action ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "compsciguy_stripe_subscription" ADD CONSTRAINT "compsciguy_stripe_subscription_user_id_compsciguy_user_id_fk" FOREIGN KEY ("user_id") REFERENCES "public"."compsciguy_user"("id") ON DELETE no action ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "compsciguy_stripe_subscription" ADD CONSTRAINT "compsciguy_stripe_subscription_stripe_price_id_compsciguy_stripe_price_stripe_price_id_fk" FOREIGN KEY ("stripe_price_id") REFERENCES "public"."compsciguy_stripe_price"("stripe_price_id") ON DELETE no action ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "compsciguy_user_course_enrollments" ADD CONSTRAINT "compsciguy_user_course_enrollments_user_id_compsciguy_user_id_fk" FOREIGN KEY ("user_id") REFERENCES "public"."compsciguy_user"("id") ON DELETE cascade ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "compsciguy_user_course_enrollments" ADD CONSTRAINT "compsciguy_user_course_enrollments_course_id_compsciguy_courses_id_fk" FOREIGN KEY ("course_id") REFERENCES "public"."compsciguy_courses"("id") ON DELETE cascade ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "compsciguy_user_lessons_complete" ADD CONSTRAINT "compsciguy_user_lessons_complete_user_id_compsciguy_user_id_fk" FOREIGN KEY ("user_id") REFERENCES "public"."compsciguy_user"("id") ON DELETE cascade ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "compsciguy_user_lessons_complete" ADD CONSTRAINT "compsciguy_user_lessons_complete_lesson_id_compsciguy_lessons_id_fk" FOREIGN KEY ("lesson_id") REFERENCES "public"."compsciguy_lessons"("id") ON DELETE cascade ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
