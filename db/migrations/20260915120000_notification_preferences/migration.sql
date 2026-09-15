CREATE TABLE `notification_preference` (
	`id` varchar(36) PRIMARY KEY,
	`business_id` varchar(36) NOT NULL,
	`type` enum('low_stock_alert','expiry_alert','order_created','order_paid','order_status_updated') NOT NULL,
	`in_app` boolean NOT NULL DEFAULT true,
	`email` boolean NOT NULL DEFAULT false,
	`sms` boolean NOT NULL DEFAULT false,
	`created_at` timestamp NOT NULL DEFAULT (now()),
	`updated_at` timestamp NOT NULL DEFAULT (now()),
	CONSTRAINT `notification_preference_business_type_unique` UNIQUE INDEX(`business_id`,`type`)
);
--> statement-breakpoint
ALTER TABLE `notification_preference` ADD CONSTRAINT `notification_preference_business_id_business_id_fkey` FOREIGN KEY (`business_id`) REFERENCES `business`(`id`) ON DELETE CASCADE;
