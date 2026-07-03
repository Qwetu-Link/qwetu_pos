CREATE TYPE "status" AS ENUM('healthy', 'low', 'critical', 'reorder');--> statement-breakpoint
CREATE TABLE "product_images" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid(),
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
	"name" varchar(255) NOT NULL,
	"category_id" uuid,
	"brand" varchar(50) NOT NULL,
	"description" varchar(1000),
	"created_at" timestamp DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE "category" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid(),
	"name" varchar(255) NOT NULL UNIQUE,
	"description" varchar,
	"icon" varchar(255),
	"product_count" integer DEFAULT 0
);
--> statement-breakpoint
CREATE TABLE "locations" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid(),
	"name" varchar(255) NOT NULL UNIQUE,
	"stock" integer DEFAULT 0 NOT NULL,
	"reorder_point" integer DEFAULT 0 NOT NULL
);
--> statement-breakpoint
CREATE TABLE "variant_inventory" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid(),
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
	"sku" varchar NOT NULL UNIQUE,
	"color" varchar NOT NULL,
	"size" varchar NOT NULL,
	"buy_price" integer DEFAULT 0 NOT NULL,
	"sell_price" integer DEFAULT 0 NOT NULL,
	"product_id" uuid NOT NULL,
	"created_at" timestamp DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE UNIQUE INDEX "variant_location_unique" ON "variant_inventory" ("variant_id","location_id");--> statement-breakpoint
CREATE UNIQUE INDEX "unique_variant" ON "variants" ("product_id","color","size");--> statement-breakpoint
ALTER TABLE "product_images" ADD CONSTRAINT "product_images_product_id_products_id_fkey" FOREIGN KEY ("product_id") REFERENCES "products"("id") ON DELETE CASCADE;--> statement-breakpoint
ALTER TABLE "products" ADD CONSTRAINT "products_category_id_category_id_fkey" FOREIGN KEY ("category_id") REFERENCES "category"("id") ON DELETE RESTRICT;--> statement-breakpoint
ALTER TABLE "variant_inventory" ADD CONSTRAINT "variant_inventory_variant_id_variants_id_fkey" FOREIGN KEY ("variant_id") REFERENCES "variants"("id") ON DELETE CASCADE;--> statement-breakpoint
ALTER TABLE "variant_inventory" ADD CONSTRAINT "variant_inventory_location_id_locations_id_fkey" FOREIGN KEY ("location_id") REFERENCES "locations"("id") ON DELETE CASCADE;--> statement-breakpoint
ALTER TABLE "variants" ADD CONSTRAINT "variants_product_id_products_id_fkey" FOREIGN KEY ("product_id") REFERENCES "products"("id") ON DELETE CASCADE;