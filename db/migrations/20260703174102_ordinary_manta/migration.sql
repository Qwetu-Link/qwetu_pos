ALTER TABLE "business_users" RENAME TO "business_team";--> statement-breakpoint
ALTER TABLE "business_profile" RENAME TO "business";--> statement-breakpoint
ALTER TABLE "category" DROP CONSTRAINT "category_name_key";--> statement-breakpoint
ALTER TABLE "product_images" ADD COLUMN "business_id" uuid NOT NULL;--> statement-breakpoint
ALTER TABLE "products" ADD COLUMN "business_id" uuid NOT NULL;--> statement-breakpoint
ALTER TABLE "category" ADD COLUMN "business_id" uuid NOT NULL;--> statement-breakpoint
ALTER TABLE "locations" ADD COLUMN "business_id" uuid NOT NULL;--> statement-breakpoint
ALTER TABLE "variant_inventory" ADD COLUMN "business_id" uuid NOT NULL;--> statement-breakpoint
ALTER TABLE "variants" ADD COLUMN "business_id" uuid NOT NULL;--> statement-breakpoint
ALTER TABLE "customers" ADD COLUMN "business_id" uuid NOT NULL;--> statement-breakpoint
ALTER TABLE "order_items" ADD COLUMN "business_id" uuid NOT NULL;--> statement-breakpoint
ALTER TABLE "orders" ADD COLUMN "business_id" uuid NOT NULL;--> statement-breakpoint
ALTER TABLE "payments" ADD COLUMN "business_id" uuid NOT NULL;--> statement-breakpoint
ALTER TABLE "invoices" ADD COLUMN "business_id" uuid NOT NULL;--> statement-breakpoint
ALTER TABLE "business_team" ADD COLUMN "business_id" uuid NOT NULL;--> statement-breakpoint
ALTER TABLE "roles" ADD COLUMN "business_id" uuid NOT NULL;--> statement-breakpoint
CREATE UNIQUE INDEX "unique_name" ON "category" ("business_id","name");--> statement-breakpoint
CREATE UNIQUE INDEX "unique_sku" ON "variants" ("sku","business_id");--> statement-breakpoint
CREATE UNIQUE INDEX "business_customer_email" ON "customers" ("business_id","email");--> statement-breakpoint
CREATE UNIQUE INDEX "business_invoice" ON "invoices" ("business_id","invoice_number");--> statement-breakpoint
ALTER TABLE "product_images" ADD CONSTRAINT "product_images_business_id_business_id_fkey" FOREIGN KEY ("business_id") REFERENCES "business"("id") ON DELETE CASCADE;--> statement-breakpoint
ALTER TABLE "products" ADD CONSTRAINT "products_business_id_business_id_fkey" FOREIGN KEY ("business_id") REFERENCES "business"("id") ON DELETE CASCADE;--> statement-breakpoint
ALTER TABLE "category" ADD CONSTRAINT "category_business_id_business_id_fkey" FOREIGN KEY ("business_id") REFERENCES "business"("id") ON DELETE CASCADE;--> statement-breakpoint
ALTER TABLE "locations" ADD CONSTRAINT "locations_business_id_business_id_fkey" FOREIGN KEY ("business_id") REFERENCES "business"("id") ON DELETE CASCADE;--> statement-breakpoint
ALTER TABLE "variant_inventory" ADD CONSTRAINT "variant_inventory_business_id_business_id_fkey" FOREIGN KEY ("business_id") REFERENCES "business"("id") ON DELETE CASCADE;--> statement-breakpoint
ALTER TABLE "variants" ADD CONSTRAINT "variants_business_id_business_id_fkey" FOREIGN KEY ("business_id") REFERENCES "business"("id") ON DELETE CASCADE;--> statement-breakpoint
ALTER TABLE "customers" ADD CONSTRAINT "customers_business_id_business_id_fkey" FOREIGN KEY ("business_id") REFERENCES "business"("id") ON DELETE CASCADE;--> statement-breakpoint
ALTER TABLE "order_items" ADD CONSTRAINT "order_items_business_id_business_id_fkey" FOREIGN KEY ("business_id") REFERENCES "business"("id") ON DELETE CASCADE;--> statement-breakpoint
ALTER TABLE "orders" ADD CONSTRAINT "orders_business_id_business_id_fkey" FOREIGN KEY ("business_id") REFERENCES "business"("id") ON DELETE CASCADE;--> statement-breakpoint
ALTER TABLE "payments" ADD CONSTRAINT "payments_business_id_business_id_fkey" FOREIGN KEY ("business_id") REFERENCES "business"("id") ON DELETE CASCADE;--> statement-breakpoint
ALTER TABLE "invoices" ADD CONSTRAINT "invoices_business_id_business_id_fkey" FOREIGN KEY ("business_id") REFERENCES "business"("id") ON DELETE CASCADE;--> statement-breakpoint
ALTER TABLE "business_team" ADD CONSTRAINT "business_team_business_id_business_id_fkey" FOREIGN KEY ("business_id") REFERENCES "business"("id") ON DELETE CASCADE;--> statement-breakpoint
ALTER TABLE "roles" ADD CONSTRAINT "roles_business_id_business_id_fkey" FOREIGN KEY ("business_id") REFERENCES "business"("id") ON DELETE CASCADE;