CREATE TABLE "lccomputerscience_stripePlans" (
	"id" text PRIMARY KEY NOT NULL,
	"name" text NOT NULL,
	"price" integer NOT NULL,
	"priceId" text NOT NULL,
	CONSTRAINT "lccomputerscience_stripePlans_priceId_unique" UNIQUE("priceId")
);
--> statement-breakpoint
CREATE TABLE "lccomputerscience_subscription" (
	"id" text PRIMARY KEY NOT NULL,
	"plan" text,
	"referenceId" text,
	"stripeCustomerId" text,
	"stripeSubscriptionId" text,
	"status" text,
	"periodStart" timestamp,
	"periodEnd" timestamp,
	"cancelAtPeriodEnd" boolean DEFAULT false,
	"seats" integer,
	"trialStart" timestamp,
	"trialEnd" timestamp
);
--> statement-breakpoint
ALTER TABLE "compsciguy_stripe_customer" DISABLE ROW LEVEL SECURITY;--> statement-breakpoint
ALTER TABLE "compsciguy_stripe_price" DISABLE ROW LEVEL SECURITY;--> statement-breakpoint
ALTER TABLE "compsciguy_stripe_product" DISABLE ROW LEVEL SECURITY;--> statement-breakpoint
ALTER TABLE "compsciguy_stripe_subscription" DISABLE ROW LEVEL SECURITY;--> statement-breakpoint
DROP TABLE "compsciguy_stripe_customer" CASCADE;--> statement-breakpoint
DROP TABLE "compsciguy_stripe_price" CASCADE;--> statement-breakpoint
DROP TABLE "compsciguy_stripe_product" CASCADE;--> statement-breakpoint
DROP TABLE "compsciguy_stripe_subscription" CASCADE;--> statement-breakpoint
ALTER TABLE "compsciguy_account" RENAME TO "lccomputerscience_account";--> statement-breakpoint
ALTER TABLE "compsciguy_courses" RENAME TO "lccomputerscience_courses";--> statement-breakpoint
ALTER TABLE "compsciguy_lessons" RENAME TO "lccomputerscience_lessons";--> statement-breakpoint
ALTER TABLE "compsciguy_modules" RENAME TO "lccomputerscience_modules";--> statement-breakpoint
ALTER TABLE "compsciguy_session" RENAME TO "lccomputerscience_session";--> statement-breakpoint
ALTER TABLE "compsciguy_user" RENAME TO "lccomputerscience_user";--> statement-breakpoint
ALTER TABLE "compsciguy_user_course_enrollments" RENAME TO "lccomputerscience_user_course_enrollments";--> statement-breakpoint
ALTER TABLE "compsciguy_user_lessons_complete" RENAME TO "lccomputerscience_user_lessons_complete";--> statement-breakpoint
ALTER TABLE "compsciguy_verification" RENAME TO "lccomputerscience_verification";--> statement-breakpoint
ALTER TABLE "lccomputerscience_session" DROP CONSTRAINT "compsciguy_session_token_unique";--> statement-breakpoint
ALTER TABLE "lccomputerscience_user" DROP CONSTRAINT "compsciguy_user_email_unique";--> statement-breakpoint
ALTER TABLE "lccomputerscience_account" DROP CONSTRAINT "compsciguy_account_user_id_compsciguy_user_id_fk";
--> statement-breakpoint
ALTER TABLE "lccomputerscience_lessons" DROP CONSTRAINT "compsciguy_lessons_module_id_compsciguy_modules_id_fk";
--> statement-breakpoint
ALTER TABLE "lccomputerscience_modules" DROP CONSTRAINT "compsciguy_modules_course_id_compsciguy_courses_id_fk";
--> statement-breakpoint
ALTER TABLE "lccomputerscience_session" DROP CONSTRAINT "compsciguy_session_user_id_compsciguy_user_id_fk";
--> statement-breakpoint
ALTER TABLE "lccomputerscience_user_course_enrollments" DROP CONSTRAINT "compsciguy_user_course_enrollments_user_id_compsciguy_user_id_fk";
--> statement-breakpoint
ALTER TABLE "lccomputerscience_user_course_enrollments" DROP CONSTRAINT "compsciguy_user_course_enrollments_course_id_compsciguy_courses_id_fk";
--> statement-breakpoint
ALTER TABLE "lccomputerscience_user_lessons_complete" DROP CONSTRAINT "compsciguy_user_lessons_complete_user_id_compsciguy_user_id_fk";
--> statement-breakpoint
ALTER TABLE "lccomputerscience_user_lessons_complete" DROP CONSTRAINT "compsciguy_user_lessons_complete_lesson_id_compsciguy_lessons_id_fk";
--> statement-breakpoint
ALTER TABLE "lccomputerscience_user" ALTER COLUMN "tier" SET DATA TYPE text;--> statement-breakpoint
ALTER TABLE "lccomputerscience_user" ALTER COLUMN "tier" SET DEFAULT 'free'::text;--> statement-breakpoint
DROP TYPE "public"."user_tier";--> statement-breakpoint
CREATE TYPE "public"."user_tier" AS ENUM('free', 'pro', 'bronze', 'silver', 'gold');--> statement-breakpoint
ALTER TABLE "lccomputerscience_user" ALTER COLUMN "tier" SET DEFAULT 'free'::"public"."user_tier";--> statement-breakpoint
ALTER TABLE "lccomputerscience_user" ALTER COLUMN "tier" SET DATA TYPE "public"."user_tier" USING "tier"::"public"."user_tier";--> statement-breakpoint
ALTER TABLE "lccomputerscience_user" ADD COLUMN "stripe_customer_id" text;--> statement-breakpoint
ALTER TABLE "lccomputerscience_account" ADD CONSTRAINT "lccomputerscience_account_user_id_lccomputerscience_user_id_fk" FOREIGN KEY ("user_id") REFERENCES "public"."lccomputerscience_user"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "lccomputerscience_lessons" ADD CONSTRAINT "lccomputerscience_lessons_module_id_lccomputerscience_modules_id_fk" FOREIGN KEY ("module_id") REFERENCES "public"."lccomputerscience_modules"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "lccomputerscience_modules" ADD CONSTRAINT "lccomputerscience_modules_course_id_lccomputerscience_courses_id_fk" FOREIGN KEY ("course_id") REFERENCES "public"."lccomputerscience_courses"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "lccomputerscience_session" ADD CONSTRAINT "lccomputerscience_session_user_id_lccomputerscience_user_id_fk" FOREIGN KEY ("user_id") REFERENCES "public"."lccomputerscience_user"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "lccomputerscience_user_course_enrollments" ADD CONSTRAINT "lccomputerscience_user_course_enrollments_user_id_lccomputerscience_user_id_fk" FOREIGN KEY ("user_id") REFERENCES "public"."lccomputerscience_user"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "lccomputerscience_user_course_enrollments" ADD CONSTRAINT "lccomputerscience_user_course_enrollments_course_id_lccomputerscience_courses_id_fk" FOREIGN KEY ("course_id") REFERENCES "public"."lccomputerscience_courses"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "lccomputerscience_user_lessons_complete" ADD CONSTRAINT "lccomputerscience_user_lessons_complete_user_id_lccomputerscience_user_id_fk" FOREIGN KEY ("user_id") REFERENCES "public"."lccomputerscience_user"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "lccomputerscience_user_lessons_complete" ADD CONSTRAINT "lccomputerscience_user_lessons_complete_lesson_id_lccomputerscience_lessons_id_fk" FOREIGN KEY ("lesson_id") REFERENCES "public"."lccomputerscience_lessons"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "lccomputerscience_session" ADD CONSTRAINT "lccomputerscience_session_token_unique" UNIQUE("token");--> statement-breakpoint
ALTER TABLE "lccomputerscience_user" ADD CONSTRAINT "lccomputerscience_user_email_unique" UNIQUE("email");--> statement-breakpoint
DROP TYPE "public"."pricing_interval";--> statement-breakpoint
DROP TYPE "public"."pricing_type";--> statement-breakpoint
DROP TYPE "public"."product_tier";--> statement-breakpoint
DROP TYPE "public"."stripe_subscription_status";
