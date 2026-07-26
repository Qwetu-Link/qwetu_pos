ALTER TABLE "order_items" ADD COLUMN IF NOT EXISTS "original_price" integer;--> statement-breakpoint
UPDATE "order_items" SET "original_price" = "price" WHERE "original_price" IS NULL;
