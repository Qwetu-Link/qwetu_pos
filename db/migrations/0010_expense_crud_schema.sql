ALTER TABLE "transactions" ALTER COLUMN "payment_id" DROP NOT NULL;--> statement-breakpoint
CREATE TYPE "public"."expense_status" AS ENUM('approved', 'pending', 'rejected');--> statement-breakpoint
ALTER TABLE "expenses" ADD COLUMN IF NOT EXISTS "status" "expense_status" DEFAULT 'pending' NOT NULL;
