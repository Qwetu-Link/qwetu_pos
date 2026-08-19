CREATE TABLE `business_subscriptions` (
	`id` varchar(36) PRIMARY KEY,
	`business_id` varchar(36) NOT NULL,
	`plan_id` varchar(36),
	`plan_name` varchar(80) NOT NULL DEFAULT 'Trial',
	`billing_cycle` enum('monthly','annual') NOT NULL DEFAULT 'monthly',
	`price` int NOT NULL DEFAULT 0,
	`payment_status` enum('paid','pending','failed','refunded') NOT NULL DEFAULT 'pending',
	`status` enum('active','trial','suspended','expired') NOT NULL DEFAULT 'trial',
	`auto_renewal` boolean NOT NULL DEFAULT true,
	`renewal_date` timestamp,
	`expiry_date` timestamp,
	`created_at` timestamp NOT NULL DEFAULT (now()),
	`updated_at` timestamp NOT NULL DEFAULT (now())
);
--> statement-breakpoint
CREATE TABLE `platform_settings` (
	`id` varchar(36) PRIMARY KEY,
	`key` varchar(120) NOT NULL,
	`value` json NOT NULL,
	`updated_by` varchar(36),
	`created_at` timestamp NOT NULL DEFAULT (now()),
	`updated_at` timestamp NOT NULL DEFAULT (now()),
	CONSTRAINT `key_unique` UNIQUE INDEX(`key`)
);
--> statement-breakpoint
CREATE TABLE `subscription_plans` (
	`id` varchar(36) PRIMARY KEY,
	`name` varchar(80) NOT NULL,
	`monthly_price` int NOT NULL DEFAULT 0,
	`annual_price` int NOT NULL DEFAULT 0,
	`user_limit` int NOT NULL DEFAULT 1,
	`branch_limit` int NOT NULL DEFAULT 1,
	`support_level` varchar(100) NOT NULL DEFAULT 'Standard',
	`features` json NOT NULL DEFAULT ('[]'),
	`is_popular` boolean NOT NULL DEFAULT false,
	`is_active` boolean NOT NULL DEFAULT true,
	`created_at` timestamp NOT NULL DEFAULT (now()),
	`updated_at` timestamp NOT NULL DEFAULT (now()),
	CONSTRAINT `name_unique` UNIQUE INDEX(`name`)
);
--> statement-breakpoint
CREATE TABLE `superadmin_notifications` (
	`id` varchar(36) PRIMARY KEY,
	`title` varchar(180) NOT NULL,
	`message` varchar(500) NOT NULL,
	`category` enum('business','subscription','payment','whatsapp','system','security') NOT NULL DEFAULT 'system',
	`priority` enum('high','medium','low') NOT NULL DEFAULT 'medium',
	`is_read` boolean NOT NULL DEFAULT false,
	`is_archived` boolean NOT NULL DEFAULT false,
	`actor_user_id` varchar(36),
	`business_id` varchar(36),
	`created_at` timestamp NOT NULL DEFAULT (now()),
	`updated_at` timestamp NOT NULL DEFAULT (now())
);
--> statement-breakpoint
CREATE TABLE `whatsapp_connections` (
	`id` varchar(36) PRIMARY KEY,
	`business_id` varchar(36) NOT NULL,
	`phone_number` varchar(30) NOT NULL,
	`phone_number_id` varchar(100) NOT NULL,
	`business_account_id` varchar(100) NOT NULL,
	`status` enum('connected','disconnected','pending') NOT NULL DEFAULT 'pending',
	`token_status` enum('valid','expired','invalid') NOT NULL DEFAULT 'valid',
	`last_sync_at` timestamp,
	`created_at` timestamp NOT NULL DEFAULT (now()),
	`updated_at` timestamp NOT NULL DEFAULT (now())
);
--> statement-breakpoint
CREATE TABLE `whatsapp_templates` (
	`id` varchar(36) PRIMARY KEY,
	`name` varchar(120) NOT NULL,
	`category` enum('Authentication','Utility','Marketing') NOT NULL DEFAULT 'Utility',
	`language` varchar(20) NOT NULL DEFAULT 'en_US',
	`status` enum('approved','pending','rejected') NOT NULL DEFAULT 'pending',
	`variables` int NOT NULL DEFAULT 0,
	`header` varchar(255),
	`body` varchar(1000) NOT NULL,
	`footer` varchar(255),
	`created_at` timestamp NOT NULL DEFAULT (now()),
	`updated_at` timestamp NOT NULL DEFAULT (now())
);
--> statement-breakpoint
ALTER TABLE `business` ADD `description` varchar(1000);--> statement-breakpoint
ALTER TABLE `business` ADD `whatsapp_status` boolean DEFAULT false NOT NULL;--> statement-breakpoint
ALTER TABLE `business_subscriptions` ADD CONSTRAINT `business_subscriptions_business_id_business_id_fkey` FOREIGN KEY (`business_id`) REFERENCES `business`(`id`) ON DELETE CASCADE;--> statement-breakpoint
ALTER TABLE `business_subscriptions` ADD CONSTRAINT `business_subscriptions_plan_id_subscription_plans_id_fkey` FOREIGN KEY (`plan_id`) REFERENCES `subscription_plans`(`id`) ON DELETE SET NULL;--> statement-breakpoint
ALTER TABLE `platform_settings` ADD CONSTRAINT `platform_settings_updated_by_user_id_fkey` FOREIGN KEY (`updated_by`) REFERENCES `user`(`id`) ON DELETE SET NULL;--> statement-breakpoint
ALTER TABLE `superadmin_notifications` ADD CONSTRAINT `superadmin_notifications_actor_user_id_user_id_fkey` FOREIGN KEY (`actor_user_id`) REFERENCES `user`(`id`) ON DELETE SET NULL;--> statement-breakpoint
ALTER TABLE `superadmin_notifications` ADD CONSTRAINT `superadmin_notifications_business_id_business_id_fkey` FOREIGN KEY (`business_id`) REFERENCES `business`(`id`) ON DELETE SET NULL;--> statement-breakpoint
ALTER TABLE `whatsapp_connections` ADD CONSTRAINT `whatsapp_connections_business_id_business_id_fkey` FOREIGN KEY (`business_id`) REFERENCES `business`(`id`) ON DELETE CASCADE;