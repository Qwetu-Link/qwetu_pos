ALTER TABLE "locations" DROP CONSTRAINT "locations_name_unique";--> statement-breakpoint
CREATE UNIQUE INDEX "business_location_unique" ON "locations" USING btree ("business_id","name");