ALTER TABLE "lccomputerscience_user" ALTER COLUMN "tier" SET DATA TYPE text;--> statement-breakpoint
ALTER TABLE "lccomputerscience_user" ALTER COLUMN "tier" SET DEFAULT 'free'::text;--> statement-breakpoint
DROP TYPE "public"."user_tier";--> statement-breakpoint
CREATE TYPE "public"."user_tier" AS ENUM('free', 'pro');--> statement-breakpoint
ALTER TABLE "lccomputerscience_user" ALTER COLUMN "tier" SET DEFAULT 'free'::"public"."user_tier";--> statement-breakpoint
ALTER TABLE "lccomputerscience_user" ALTER COLUMN "tier" SET DATA TYPE "public"."user_tier" USING "tier"::"public"."user_tier";