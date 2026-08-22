CREATE TABLE `subscription` (
	`id` varchar(36) PRIMARY KEY,
	`business_id` varchar(36),
	`plan` enum('Trial','Starter','Professional','Enterprise') NOT NULL DEFAULT 'Trial',
	`billing_cycle` enum('monthly','quartely','semi-annual','annual') NOT NULL DEFAULT 'monthly',
	`description` varchar(255),
	`salary` int DEFAULT 0,
	`payment_status` enum('paid','pending','failed','refunded') NOT NULL DEFAULT 'pending',
	`renewal_date` varchar(255),
	`expiry_date` varchar(255),
	`status` varchar(255),
	`auto_renewal` boolean NOT NULL DEFAULT false,
	`created_at` timestamp NOT NULL DEFAULT (now()),
	`updated_at` timestamp NOT NULL DEFAULT (now()),
	CONSTRAINT `unique_plan_idx` UNIQUE INDEX(`business_id`,`plan`),
	CONSTRAINT `subscription_business_id_business_id_fkey` FOREIGN KEY (`business_id`) REFERENCES `business`(`id`)
);
--> statement-breakpoint
ALTER TABLE `business_subscriptions` DROP CONSTRAINT `business_subscriptions_plan_id_subscription_plans_id_fkey`;--> statement-breakpoint
DROP TABLE `business_subscriptions`;--> statement-breakpoint
DROP TABLE `platform_settings`;--> statement-breakpoint
DROP TABLE `subscription_plans`;--> statement-breakpoint
DROP TABLE `superadmin_notifications`;--> statement-breakpoint
DROP TABLE `whatsapp_connections`;--> statement-breakpoint
DROP TABLE `whatsapp_templates`;--> statement-breakpoint
ALTER TABLE `business` ADD `plan` enum('trial','starter','professional','enterprise') DEFAULT 'starter' NOT NULL;--> statement-breakpoint
ALTER TABLE `business` ADD `status` enum('trial','active','suspended','expired') DEFAULT 'active' NOT NULL;--> statement-breakpoint
ALTER TABLE `business` ADD `industry` varchar(255);--> statement-breakpoint
ALTER TABLE `business` ADD `users` int DEFAULT 0;--> statement-breakpoint
ALTER TABLE `business` ADD `branches` int DEFAULT 0;