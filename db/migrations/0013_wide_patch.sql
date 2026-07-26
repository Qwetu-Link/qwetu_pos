CREATE TYPE "public"."expense_category" AS ENUM('rent', 'utilities', 'salaries', 'transport', 'supplies', 'inventory_purchase', 'marketing', 'equipment', 'maintenance', 'insurance', 'taxes', 'loan_repayment', 'other');--> statement-breakpoint
CREATE TYPE "public"."expense_status" AS ENUM('approved', 'pending', 'rejected');--> statement-breakpoint
CREATE TABLE "expense_items" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"business_id" uuid NOT NULL,
	"expense_id" uuid NOT NULL,
	"name" varchar(255) NOT NULL,
	"quantity" integer DEFAULT 1 NOT NULL,
	"unit_cost" integer NOT NULL,
	"total" integer NOT NULL,
	"created_at" timestamp DEFAULT now() NOT NULL,
	"updated_at" timestamp DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE "expenses" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"business_id" uuid NOT NULL,
	"expense_no" varchar(20) NOT NULL,
	"transaction_id" uuid NOT NULL,
	"category" "expense_category" NOT NULL,
	"vendor_name" varchar(150),
	"vendor_contact" varchar(50),
	"amount" integer NOT NULL,
	"status" "expense_status" DEFAULT 'pending' NOT NULL,
	"receipt_url" varchar(500),
	"is_recurring" boolean DEFAULT false,
	"approved_by" uuid,
	"approved_at" timestamp,
	"notes" varchar(500),
	"created_at" timestamp DEFAULT now() NOT NULL,
	"updated_at" timestamp DEFAULT now() NOT NULL
);
--> statement-breakpoint
ALTER TABLE "transactions" ALTER COLUMN "payment_id" DROP NOT NULL;--> statement-breakpoint
ALTER TABLE "order_items" ADD COLUMN "original_price" integer;--> statement-breakpoint
ALTER TABLE "expense_items" ADD CONSTRAINT "expense_items_business_id_business_id_fk" FOREIGN KEY ("business_id") REFERENCES "public"."business"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "expense_items" ADD CONSTRAINT "expense_items_expense_id_expenses_id_fk" FOREIGN KEY ("expense_id") REFERENCES "public"."expenses"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "expenses" ADD CONSTRAINT "expenses_business_id_business_id_fk" FOREIGN KEY ("business_id") REFERENCES "public"."business"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "expenses" ADD CONSTRAINT "expenses_transaction_id_transactions_id_fk" FOREIGN KEY ("transaction_id") REFERENCES "public"."transactions"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
CREATE INDEX "expense_items_expense_idx" ON "expense_items" USING btree ("expense_id");--> statement-breakpoint
CREATE UNIQUE INDEX "business_expense_no_idx" ON "expenses" USING btree ("business_id","expense_no");