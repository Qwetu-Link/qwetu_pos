CREATE TYPE "status" AS ENUM('healthy', 'low', 'critical', 'reorder');--> statement-breakpoint
CREATE TYPE "risk" AS ENUM('low', 'medium', 'high');--> statement-breakpoint
CREATE TYPE "segment" AS ENUM('New', 'Regular', 'VIP');--> statement-breakpoint
CREATE TYPE "order_status" AS ENUM('pending', 'processing', 'shipped', 'delivered', 'cancelled');--> statement-breakpoint
CREATE TYPE "payment_method" AS ENUM('cash', 'mpesa', 'bank');--> statement-breakpoint
CREATE TYPE "payment_status" AS ENUM('paid', 'partial', 'unpaid');--> statement-breakpoint
CREATE TYPE "payment_type" AS ENUM('full', 'installment');--> statement-breakpoint
CREATE TYPE "invoice_status" AS ENUM('draft', 'issued', 'partially_paid', 'paid', 'overdue', 'cancelled');--> statement-breakpoint
CREATE TABLE "product_images" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid(),
	"business_id" uuid NOT NULL,
	"product_id" uuid NOT NULL,
	"original_path" varchar(1000) NOT NULL,
	"optimized_path" varchar(1000),
	"thumbnail_path" varchar(1000),
	"watermarked_path" varchar(1000),
	"alt" varchar(255),
	"mime_type" varchar(100),
	"width" integer,
	"height" integer,
	"file_size" integer,
	"display_order" integer DEFAULT 0 NOT NULL,
	"is_primary" boolean DEFAULT false NOT NULL,
	"created_at" timestamp DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE "products" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid(),
	"business_id" uuid NOT NULL,
	"name" varchar(255) NOT NULL,
	"category_id" uuid,
	"brand" varchar(50) NOT NULL,
	"description" varchar(1000),
	"created_at" timestamp DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE "category" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid(),
	"business_id" uuid NOT NULL,
	"name" varchar(255) NOT NULL,
	"description" varchar,
	"icon" varchar(255),
	"product_count" integer DEFAULT 0
);
--> statement-breakpoint
CREATE TABLE "locations" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid(),
	"business_id" uuid NOT NULL,
	"name" varchar(255) NOT NULL UNIQUE,
	"stock" integer DEFAULT 0 NOT NULL,
	"reorder_point" integer DEFAULT 0 NOT NULL
);
--> statement-breakpoint
CREATE TABLE "variant_inventory" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid(),
	"business_id" uuid NOT NULL,
	"variant_id" uuid NOT NULL,
	"location_id" uuid NOT NULL,
	"total_stock" integer DEFAULT 0 NOT NULL,
	"reorder_point" integer DEFAULT 0 NOT NULL,
	"last_restocked" timestamp,
	"status" "status" DEFAULT 'healthy'::"status" NOT NULL
);
--> statement-breakpoint
CREATE TABLE "variants" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid(),
	"business_id" uuid NOT NULL,
	"sku" varchar NOT NULL UNIQUE,
	"color" varchar NOT NULL,
	"size" varchar NOT NULL,
	"buy_price" integer DEFAULT 0 NOT NULL,
	"sell_price" integer DEFAULT 0 NOT NULL,
	"product_id" uuid NOT NULL,
	"created_at" timestamp DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE "customers" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid(),
	"business_id" uuid NOT NULL,
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
	"business_id" uuid NOT NULL,
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
	"business_id" uuid NOT NULL,
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
	"business_id" uuid NOT NULL,
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
	"business_id" uuid NOT NULL,
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
CREATE TABLE "permission" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid(),
	"name" varchar(100) NOT NULL UNIQUE,
	"description" varchar(255),
	"group" varchar(50) NOT NULL
);
--> statement-breakpoint
CREATE TABLE "role_permission" (
	"role_id" uuid,
	"permission_id" uuid,
	"created_at" timestamp DEFAULT now() NOT NULL,
	CONSTRAINT "role_permissions_pk" PRIMARY KEY("role_id","permission_id")
);
--> statement-breakpoint
CREATE TABLE "user" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid(),
	"name" varchar,
	"first_name" varchar(100),
	"last_name" varchar(100),
	"email" varchar NOT NULL UNIQUE,
	"phone" varchar(20),
	"emailVerified" timestamp,
	"image" text,
	"password_hash" varchar(255),
	"business_id" uuid,
	"role_id" uuid,
	"is_active" boolean DEFAULT true NOT NULL,
	"created_at" timestamp DEFAULT now() NOT NULL,
	"updated_at" timestamp
);
--> statement-breakpoint
CREATE TABLE "account" (
	"user_id" uuid NOT NULL,
	"type" text NOT NULL,
	"provider" text NOT NULL,
	"providerAccountId" text NOT NULL,
	"refresh_token" text,
	"access_token" text,
	"expires_at" integer,
	"token_type" text,
	"scope" text,
	"id_token" text,
	"session_state" text
);
--> statement-breakpoint
CREATE TABLE "business" (
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
CREATE TABLE "session" (
	"sessionToken" text PRIMARY KEY,
	"user_id" uuid NOT NULL,
	"expires" timestamp NOT NULL
);
--> statement-breakpoint
CREATE TABLE "verificationToken" (
	"identifier" text NOT NULL,
	"token" text NOT NULL,
	"expires" timestamp NOT NULL
);
--> statement-breakpoint
CREATE TABLE "roles" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid(),
	"business_id" uuid,
	"name" varchar(50) NOT NULL UNIQUE,
	"description" varchar(255),
	"salary" integer DEFAULT 0,
	"created_at" timestamp DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE UNIQUE INDEX "unique_name" ON "category" ("business_id","name");--> statement-breakpoint
CREATE UNIQUE INDEX "variant_location_unique" ON "variant_inventory" ("variant_id","location_id");--> statement-breakpoint
CREATE UNIQUE INDEX "unique_variant" ON "variants" ("product_id","color","size");--> statement-breakpoint
CREATE UNIQUE INDEX "unique_sku" ON "variants" ("sku","business_id");--> statement-breakpoint
CREATE UNIQUE INDEX "business_customer_email" ON "customers" ("business_id","email");--> statement-breakpoint
CREATE UNIQUE INDEX "unique_order_item" ON "order_items" ("order_id","variant_id");--> statement-breakpoint
CREATE UNIQUE INDEX "unique_order" ON "orders" ("customer_id","created_at");--> statement-breakpoint
CREATE UNIQUE INDEX "business_invoice" ON "invoices" ("business_id","invoice_number");--> statement-breakpoint
ALTER TABLE "product_images" ADD CONSTRAINT "product_images_business_id_business_id_fkey" FOREIGN KEY ("business_id") REFERENCES "business"("id") ON DELETE CASCADE;--> statement-breakpoint
ALTER TABLE "product_images" ADD CONSTRAINT "product_images_product_id_products_id_fkey" FOREIGN KEY ("product_id") REFERENCES "products"("id") ON DELETE CASCADE;--> statement-breakpoint
ALTER TABLE "products" ADD CONSTRAINT "products_business_id_business_id_fkey" FOREIGN KEY ("business_id") REFERENCES "business"("id") ON DELETE CASCADE;--> statement-breakpoint
ALTER TABLE "products" ADD CONSTRAINT "products_category_id_category_id_fkey" FOREIGN KEY ("category_id") REFERENCES "category"("id") ON DELETE RESTRICT;--> statement-breakpoint
ALTER TABLE "category" ADD CONSTRAINT "category_business_id_business_id_fkey" FOREIGN KEY ("business_id") REFERENCES "business"("id") ON DELETE CASCADE;--> statement-breakpoint
ALTER TABLE "locations" ADD CONSTRAINT "locations_business_id_business_id_fkey" FOREIGN KEY ("business_id") REFERENCES "business"("id") ON DELETE CASCADE;--> statement-breakpoint
ALTER TABLE "variant_inventory" ADD CONSTRAINT "variant_inventory_business_id_business_id_fkey" FOREIGN KEY ("business_id") REFERENCES "business"("id") ON DELETE CASCADE;--> statement-breakpoint
ALTER TABLE "variant_inventory" ADD CONSTRAINT "variant_inventory_variant_id_variants_id_fkey" FOREIGN KEY ("variant_id") REFERENCES "variants"("id") ON DELETE CASCADE;--> statement-breakpoint
ALTER TABLE "variant_inventory" ADD CONSTRAINT "variant_inventory_location_id_locations_id_fkey" FOREIGN KEY ("location_id") REFERENCES "locations"("id") ON DELETE CASCADE;--> statement-breakpoint
ALTER TABLE "variants" ADD CONSTRAINT "variants_business_id_business_id_fkey" FOREIGN KEY ("business_id") REFERENCES "business"("id") ON DELETE CASCADE;--> statement-breakpoint
ALTER TABLE "variants" ADD CONSTRAINT "variants_product_id_products_id_fkey" FOREIGN KEY ("product_id") REFERENCES "products"("id") ON DELETE CASCADE;--> statement-breakpoint
ALTER TABLE "customers" ADD CONSTRAINT "customers_business_id_business_id_fkey" FOREIGN KEY ("business_id") REFERENCES "business"("id") ON DELETE CASCADE;--> statement-breakpoint
ALTER TABLE "order_items" ADD CONSTRAINT "order_items_business_id_business_id_fkey" FOREIGN KEY ("business_id") REFERENCES "business"("id") ON DELETE CASCADE;--> statement-breakpoint
ALTER TABLE "order_items" ADD CONSTRAINT "order_items_variant_id_variants_id_fkey" FOREIGN KEY ("variant_id") REFERENCES "variants"("id") ON DELETE RESTRICT;--> statement-breakpoint
ALTER TABLE "order_items" ADD CONSTRAINT "order_items_order_id_orders_id_fkey" FOREIGN KEY ("order_id") REFERENCES "orders"("id") ON DELETE CASCADE;--> statement-breakpoint
ALTER TABLE "order_items" ADD CONSTRAINT "order_items_product_id_products_id_fkey" FOREIGN KEY ("product_id") REFERENCES "products"("id") ON DELETE RESTRICT;--> statement-breakpoint
ALTER TABLE "orders" ADD CONSTRAINT "orders_business_id_business_id_fkey" FOREIGN KEY ("business_id") REFERENCES "business"("id") ON DELETE CASCADE;--> statement-breakpoint
ALTER TABLE "orders" ADD CONSTRAINT "orders_customer_id_customers_id_fkey" FOREIGN KEY ("customer_id") REFERENCES "customers"("id") ON DELETE RESTRICT;--> statement-breakpoint
ALTER TABLE "payments" ADD CONSTRAINT "payments_business_id_business_id_fkey" FOREIGN KEY ("business_id") REFERENCES "business"("id") ON DELETE CASCADE;--> statement-breakpoint
ALTER TABLE "payments" ADD CONSTRAINT "payments_invoice_id_invoices_id_fkey" FOREIGN KEY ("invoice_id") REFERENCES "invoices"("id") ON DELETE CASCADE;--> statement-breakpoint
ALTER TABLE "invoices" ADD CONSTRAINT "invoices_business_id_business_id_fkey" FOREIGN KEY ("business_id") REFERENCES "business"("id") ON DELETE CASCADE;--> statement-breakpoint
ALTER TABLE "invoices" ADD CONSTRAINT "invoices_order_id_orders_id_fkey" FOREIGN KEY ("order_id") REFERENCES "orders"("id") ON DELETE RESTRICT;--> statement-breakpoint
ALTER TABLE "role_permission" ADD CONSTRAINT "role_permission_role_id_roles_id_fkey" FOREIGN KEY ("role_id") REFERENCES "roles"("id") ON DELETE CASCADE;--> statement-breakpoint
ALTER TABLE "role_permission" ADD CONSTRAINT "role_permission_permission_id_permission_id_fkey" FOREIGN KEY ("permission_id") REFERENCES "permission"("id") ON DELETE CASCADE;--> statement-breakpoint
ALTER TABLE "user" ADD CONSTRAINT "user_business_id_business_id_fkey" FOREIGN KEY ("business_id") REFERENCES "business"("id") ON DELETE CASCADE;--> statement-breakpoint
ALTER TABLE "user" ADD CONSTRAINT "user_role_id_roles_id_fkey" FOREIGN KEY ("role_id") REFERENCES "roles"("id") ON DELETE RESTRICT;--> statement-breakpoint
ALTER TABLE "account" ADD CONSTRAINT "account_user_id_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "user"("id") ON DELETE CASCADE;--> statement-breakpoint
ALTER TABLE "session" ADD CONSTRAINT "session_user_id_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "user"("id") ON DELETE CASCADE;--> statement-breakpoint
ALTER TABLE "roles" ADD CONSTRAINT "roles_business_id_business_id_fkey" FOREIGN KEY ("business_id") REFERENCES "business"("id") ON DELETE CASCADE;