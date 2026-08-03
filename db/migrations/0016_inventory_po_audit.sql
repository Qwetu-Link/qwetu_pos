DO $$ BEGIN
    ALTER TYPE "inventory_status" ADD VALUE IF NOT EXISTS 'incoming';
EXCEPTION
    WHEN duplicate_object THEN NULL;
END $$;

DO $$ BEGIN
    CREATE TYPE "stock_adjustment_reason" AS ENUM (
        'restock',
        'damaged_goods',
        'theft_shrinkage',
        'return',
        'physical_count_audit',
        'correction'
    );
EXCEPTION
    WHEN duplicate_object THEN NULL;
END $$;

DO $$ BEGIN
    CREATE TYPE "purchase_order_status" AS ENUM (
        'draft',
        'ordered',
        'received',
        'cancelled'
    );
EXCEPTION
    WHEN duplicate_object THEN NULL;
END $$;

CREATE TABLE IF NOT EXISTS "purchase_orders" (
    "id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
    "business_id" uuid NOT NULL,
    "po_number" varchar(40) NOT NULL,
    "supplier_name" varchar(255) NOT NULL,
    "status" "purchase_order_status" DEFAULT 'draft' NOT NULL,
    "expense_id" uuid,
    "notes" text,
    "created_by" uuid,
    "created_at" timestamp DEFAULT now() NOT NULL,
    "updated_at" timestamp DEFAULT now() NOT NULL,
    CONSTRAINT "purchase_orders_po_number_unique" UNIQUE("po_number")
);

CREATE TABLE IF NOT EXISTS "purchase_order_items" (
    "id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
    "business_id" uuid NOT NULL,
    "purchase_order_id" uuid NOT NULL,
    "variant_id" uuid NOT NULL,
    "sku" varchar(255) NOT NULL,
    "product_name" varchar(255) NOT NULL,
    "color" varchar(255) NOT NULL,
    "size" varchar(255) NOT NULL,
    "quantity" integer NOT NULL,
    "unit_cost" integer DEFAULT 0 NOT NULL,
    "created_at" timestamp DEFAULT now() NOT NULL,
    "updated_at" timestamp DEFAULT now() NOT NULL
);

CREATE TABLE IF NOT EXISTS "stock_adjustment_logs" (
    "id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
    "business_id" uuid NOT NULL,
    "variant_id" uuid NOT NULL,
    "location_id" uuid,
    "location_name" varchar(255) NOT NULL,
    "previous_quantity" integer NOT NULL,
    "new_quantity" integer NOT NULL,
    "quantity_changed" integer NOT NULL,
    "reason" "stock_adjustment_reason" NOT NULL,
    "notes" text,
    "adjusted_by" uuid,
    "adjusted_at" timestamp DEFAULT now() NOT NULL,
    "created_at" timestamp DEFAULT now() NOT NULL
);

DO $$ BEGIN
    ALTER TABLE "purchase_orders"
        ADD COLUMN IF NOT EXISTS "expense_id" uuid;
EXCEPTION
    WHEN duplicate_column THEN NULL;
END $$;

DO $$ BEGIN
    ALTER TABLE "purchase_orders"
        ADD CONSTRAINT "purchase_orders_business_id_business_id_fk"
        FOREIGN KEY ("business_id") REFERENCES "business"("id") ON DELETE cascade ON UPDATE no action;
EXCEPTION
    WHEN duplicate_object THEN NULL;
END $$;

DO $$ BEGIN
    ALTER TABLE "purchase_orders"
        ADD CONSTRAINT "purchase_orders_created_by_user_id_fk"
        FOREIGN KEY ("created_by") REFERENCES "user"("id") ON DELETE set null ON UPDATE no action;
EXCEPTION
    WHEN duplicate_object THEN NULL;
END $$;

DO $$ BEGIN
    ALTER TABLE "purchase_orders"
        ADD CONSTRAINT "purchase_orders_expense_id_expenses_id_fk"
        FOREIGN KEY ("expense_id") REFERENCES "expenses"("id") ON DELETE set null ON UPDATE no action;
EXCEPTION
    WHEN duplicate_object THEN NULL;
END $$;

DO $$ BEGIN
    ALTER TABLE "purchase_order_items"
        ADD CONSTRAINT "purchase_order_items_business_id_business_id_fk"
        FOREIGN KEY ("business_id") REFERENCES "business"("id") ON DELETE cascade ON UPDATE no action;
EXCEPTION
    WHEN duplicate_object THEN NULL;
END $$;

DO $$ BEGIN
    ALTER TABLE "purchase_order_items"
        ADD CONSTRAINT "purchase_order_items_purchase_order_id_purchase_orders_id_fk"
        FOREIGN KEY ("purchase_order_id") REFERENCES "purchase_orders"("id") ON DELETE cascade ON UPDATE no action;
EXCEPTION
    WHEN duplicate_object THEN NULL;
END $$;

DO $$ BEGIN
    ALTER TABLE "purchase_order_items"
        ADD CONSTRAINT "purchase_order_items_variant_id_variants_id_fk"
        FOREIGN KEY ("variant_id") REFERENCES "variants"("id") ON DELETE cascade ON UPDATE no action;
EXCEPTION
    WHEN duplicate_object THEN NULL;
END $$;

DO $$ BEGIN
    ALTER TABLE "stock_adjustment_logs"
        ADD CONSTRAINT "stock_adjustment_logs_business_id_business_id_fk"
        FOREIGN KEY ("business_id") REFERENCES "business"("id") ON DELETE cascade ON UPDATE no action;
EXCEPTION
    WHEN duplicate_object THEN NULL;
END $$;

DO $$ BEGIN
    ALTER TABLE "stock_adjustment_logs"
        ADD CONSTRAINT "stock_adjustment_logs_variant_id_variants_id_fk"
        FOREIGN KEY ("variant_id") REFERENCES "variants"("id") ON DELETE cascade ON UPDATE no action;
EXCEPTION
    WHEN duplicate_object THEN NULL;
END $$;

DO $$ BEGIN
    ALTER TABLE "stock_adjustment_logs"
        ADD CONSTRAINT "stock_adjustment_logs_location_id_locations_id_fk"
        FOREIGN KEY ("location_id") REFERENCES "locations"("id") ON DELETE set null ON UPDATE no action;
EXCEPTION
    WHEN duplicate_object THEN NULL;
END $$;

DO $$ BEGIN
    ALTER TABLE "stock_adjustment_logs"
        ADD CONSTRAINT "stock_adjustment_logs_adjusted_by_user_id_fk"
        FOREIGN KEY ("adjusted_by") REFERENCES "user"("id") ON DELETE set null ON UPDATE no action;
EXCEPTION
    WHEN duplicate_object THEN NULL;
END $$;

CREATE UNIQUE INDEX IF NOT EXISTS "purchase_orders_business_po_number_unique"
    ON "purchase_orders" USING btree ("business_id", "po_number");

CREATE INDEX IF NOT EXISTS "purchase_order_items_business_variant_idx"
    ON "purchase_order_items" USING btree ("business_id", "variant_id");

CREATE INDEX IF NOT EXISTS "stock_adjustment_logs_business_variant_idx"
    ON "stock_adjustment_logs" USING btree ("business_id", "variant_id", "adjusted_at");
