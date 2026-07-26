ALTER TABLE "expenses" ADD COLUMN IF NOT EXISTS "expense_no" varchar(20);--> statement-breakpoint
WITH numbered_expenses AS (
	SELECT
		"id",
		"business_id",
		'EXP-' || UPPER(SUBSTRING(REPLACE("id"::text, '-', '') FROM 1 FOR 5)) AS generated_expense_no
	FROM "expenses"
	WHERE "expense_no" IS NULL
)
UPDATE "expenses"
SET "expense_no" = numbered_expenses.generated_expense_no
FROM numbered_expenses
WHERE "expenses"."id" = numbered_expenses."id";--> statement-breakpoint
ALTER TABLE "expenses" ALTER COLUMN "expense_no" SET NOT NULL;--> statement-breakpoint
CREATE UNIQUE INDEX IF NOT EXISTS "business_expense_no_idx" ON "expenses" USING btree ("business_id","expense_no");
