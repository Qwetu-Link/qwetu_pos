CREATE TYPE "risk" AS ENUM('low', 'medium', 'high');--> statement-breakpoint
CREATE TYPE "segment" AS ENUM('New', 'Regular', 'VIP');--> statement-breakpoint
CREATE TYPE "order_status" AS ENUM('pending', 'processing', 'shipped', 'delivered', 'cancelled');--> statement-breakpoint
CREATE TYPE "payment_method" AS ENUM('cash', 'mpesa', 'bank');--> statement-breakpoint
CREATE TYPE "payment_status" AS ENUM('paid', 'partial', 'unpaid');--> statement-breakpoint
CREATE TYPE "payment_type" AS ENUM('full', 'installment');--> statement-breakpoint
CREATE TYPE "invoice_status" AS ENUM('draft', 'issued', 'partially_paid', 'paid', 'overdue', 'cancelled');--> statement-breakpoint
CREATE TABLE "customers" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid(),
	"name" varchar(255) NOT NULL,
	"email" varchar(255) NOT NULL UNIQUE,
	"phone" varchar(255),
	"address" varchar(255),
	"total_orders" integer DEFAULT 0,
	"total_spent" integer DEFAULT 0,
	"active_installments" integer DEFAULT 0,
	"payment_score" integer DEFAULT 0,
	"risk_level" "risk" DEFAULT 'low'::"risk" NOT NULL,
	"segment" "segment" DEFAULT 'New'::"segment" NOT NULL,
	"joined_date" timestamp DEFAULT now() NOT NULL,
	"last_purchase" timestamp,
	"created_at" timestamp DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE "order_items" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid(),
	"variant_id" uuid NOT NULL,
	"sku" varchar(255) NOT NULL,
	"name" varchar(255) NOT NULL,
	"order_id" uuid NOT NULL,
	"product_id" uuid NOT NULL,
	"quantity" integer NOT NULL,
	"price" integer NOT NULL
);
--> statement-breakpoint
CREATE TABLE "orders" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid(),
	"customer_id" uuid NOT NULL,
	"total" integer NOT NULL,
	"deposit_paid" integer DEFAULT 0 NOT NULL,
	"payment_status" "payment_status" DEFAULT 'unpaid'::"payment_status" NOT NULL,
	"payment_type" "payment_type" DEFAULT 'full'::"payment_type" NOT NULL,
	"installment_plan" varchar(255),
	"installment_start_date" timestamp,
	"status" "order_status" DEFAULT 'pending'::"order_status" NOT NULL,
	"start_date" timestamp,
	"created_at" timestamp DEFAULT now() NOT NULL,
	"shipping_address" varchar(500) NOT NULL
);
--> statement-breakpoint
CREATE TABLE "payments" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid(),
	"invoice_id" uuid NOT NULL,
	"amount" integer NOT NULL,
	"payment_method" "payment_method" NOT NULL,
	"reference" varchar(255),
	"received_by" uuid,
	"paid_at" timestamp DEFAULT now() NOT NULL,
	"notes" varchar(500)
);
--> statement-breakpoint
CREATE TABLE "invoices" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid(),
	"order_id" uuid NOT NULL UNIQUE,
	"invoice_number" varchar(50) NOT NULL UNIQUE,
	"subtotal" integer NOT NULL,
	"discount" integer DEFAULT 0 NOT NULL,
	"tax" integer DEFAULT 0 NOT NULL,
	"total" integer NOT NULL,
	"balance" integer NOT NULL,
	"installments" integer DEFAULT 0 NOT NULL,
	"installment_amount" integer DEFAULT 0 NOT NULL,
	"status" "invoice_status" DEFAULT 'issued'::"invoice_status" NOT NULL,
	"frequency" varchar(50),
	"start_date" timestamp,
	"end_date" timestamp,
	"due_date" timestamp,
	"created_at" timestamp DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE "business_users" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid(),
	"first_name" varchar(100) NOT NULL,
	"last_name" varchar(100) NOT NULL,
	"email" varchar(255) NOT NULL UNIQUE,
	"phone" varchar(20),
	"password_hash" varchar(255) NOT NULL,
	"role_id" uuid NOT NULL,
	"is_active" boolean DEFAULT true NOT NULL,
	"created_at" timestamp DEFAULT now() NOT NULL,
	"updated_at" timestamp
);
--> statement-breakpoint
CREATE TABLE "business_profile" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid(),
	"business_name" varchar(255) NOT NULL,
	"legal_name" varchar(255),
	"registration_number" varchar(100) NOT NULL,
	"tax_pin" varchar(50) NOT NULL,
	"email" varchar(255) NOT NULL,
	"phone" varchar(20) NOT NULL,
	"alternative_phone" varchar(20),
	"address" varchar(500),
	"city" varchar(100),
	"county" varchar(100),
	"country" varchar(100) DEFAULT 'Kenya',
	"currency" varchar(10) DEFAULT 'KES',
	"timezone" varchar(100) DEFAULT 'Africa/Nairobi',
	"logo_path" varchar(1000),
	"receipt_footer" varchar(500),
	"invoice_terms" varchar(1000),
	"is_active" boolean DEFAULT true NOT NULL,
	"created_at" timestamp DEFAULT now() NOT NULL,
	"updated_at" timestamp
);
--> statement-breakpoint
CREATE TABLE "roles" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid(),
	"name" varchar(50) NOT NULL UNIQUE,
	"description" varchar(255),
	"salary" integer DEFAULT 0 NOT NULL,
	"created_at" timestamp DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE UNIQUE INDEX "unique_order_item" ON "order_items" ("order_id","variant_id");--> statement-breakpoint
CREATE UNIQUE INDEX "unique_order" ON "orders" ("customer_id","created_at");--> statement-breakpoint
ALTER TABLE "order_items" ADD CONSTRAINT "order_items_variant_id_variants_id_fkey" FOREIGN KEY ("variant_id") REFERENCES "variants"("id") ON DELETE RESTRICT;--> statement-breakpoint
ALTER TABLE "order_items" ADD CONSTRAINT "order_items_order_id_orders_id_fkey" FOREIGN KEY ("order_id") REFERENCES "orders"("id") ON DELETE CASCADE;--> statement-breakpoint
ALTER TABLE "order_items" ADD CONSTRAINT "order_items_product_id_products_id_fkey" FOREIGN KEY ("product_id") REFERENCES "products"("id") ON DELETE RESTRICT;--> statement-breakpoint
ALTER TABLE "orders" ADD CONSTRAINT "orders_customer_id_customers_id_fkey" FOREIGN KEY ("customer_id") REFERENCES "customers"("id") ON DELETE RESTRICT;--> statement-breakpoint
ALTER TABLE "payments" ADD CONSTRAINT "payments_invoice_id_invoices_id_fkey" FOREIGN KEY ("invoice_id") REFERENCES "invoices"("id") ON DELETE CASCADE;--> statement-breakpoint
ALTER TABLE "invoices" ADD CONSTRAINT "invoices_order_id_orders_id_fkey" FOREIGN KEY ("order_id") REFERENCES "orders"("id") ON DELETE RESTRICT;--> statement-breakpoint
ALTER TABLE "business_users" ADD CONSTRAINT "business_users_role_id_roles_id_fkey" FOREIGN KEY ("role_id") REFERENCES "roles"("id") ON DELETE RESTRICT;