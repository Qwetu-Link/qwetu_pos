CREATE TABLE `product_images` (
	`id` varchar(36) PRIMARY KEY,
	`business_id` varchar(36) NOT NULL,
	`product_id` varchar(36) NOT NULL,
	`variant_id` varchar(36),
	`original_path` varchar(1000) NOT NULL,
	`optimized_path` varchar(1000),
	`thumbnail_path` varchar(1000),
	`watermarked_path` varchar(1000),
	`alt` varchar(255),
	`mime_type` varchar(100),
	`width` int,
	`height` int,
	`file_size` int,
	`display_order` int NOT NULL DEFAULT 0,
	`is_primary` boolean NOT NULL DEFAULT false,
	`created_at` timestamp NOT NULL DEFAULT (now()),
	`updated_at` timestamp NOT NULL DEFAULT (now())
);
--> statement-breakpoint
CREATE TABLE `products` (
	`id` varchar(36) PRIMARY KEY,
	`business_id` varchar(36) NOT NULL,
	`name` varchar(255) NOT NULL,
	`category_id` varchar(36),
	`brand` varchar(50) NOT NULL,
	`description` varchar(1000),
	`created_at` timestamp NOT NULL DEFAULT (now()),
	`updated_at` timestamp NOT NULL DEFAULT (now())
);
--> statement-breakpoint
CREATE TABLE `category` (
	`id` varchar(36) PRIMARY KEY,
	`business_id` varchar(36) NOT NULL,
	`name` varchar(255) NOT NULL,
	`description` varchar(1000),
	`icon` varchar(255),
	`created_at` timestamp NOT NULL DEFAULT (now()),
	`updated_at` timestamp NOT NULL DEFAULT (now()),
	CONSTRAINT `category_business_name_idx` UNIQUE INDEX(`business_id`,`name`)
);
--> statement-breakpoint
CREATE TABLE `locations` (
	`id` varchar(36) PRIMARY KEY,
	`business_id` varchar(36) NOT NULL,
	`name` varchar(255) NOT NULL,
	`stock` int NOT NULL DEFAULT 0,
	`reorder_point` int NOT NULL DEFAULT 0,
	`created_at` timestamp NOT NULL DEFAULT (now()),
	`updated_at` timestamp NOT NULL DEFAULT (now()),
	CONSTRAINT `business_location_unique` UNIQUE INDEX(`business_id`,`name`)
);
--> statement-breakpoint
CREATE TABLE `purchase_order_items` (
	`id` varchar(36) PRIMARY KEY,
	`business_id` varchar(36) NOT NULL,
	`purchase_order_id` varchar(36) NOT NULL,
	`variant_id` varchar(36) NOT NULL,
	`sku` varchar(255) NOT NULL,
	`product_name` varchar(255) NOT NULL,
	`color` varchar(255) NOT NULL,
	`size` varchar(255) NOT NULL,
	`quantity` int NOT NULL,
	`unit_cost` int NOT NULL DEFAULT 0,
	`created_at` timestamp NOT NULL DEFAULT (now()),
	`updated_at` timestamp NOT NULL DEFAULT (now())
);
--> statement-breakpoint
CREATE TABLE `purchase_orders` (
	`id` varchar(36) PRIMARY KEY,
	`business_id` varchar(36) NOT NULL,
	`po_number` varchar(40) NOT NULL,
	`supplier_name` varchar(255) NOT NULL,
	`status` enum('draft','ordered','received','cancelled') NOT NULL DEFAULT 'draft',
	`expense_id` varchar(36),
	`notes` text,
	`created_by` varchar(36),
	`created_at` timestamp NOT NULL DEFAULT (now()),
	`updated_at` timestamp NOT NULL DEFAULT (now()),
	CONSTRAINT `po_number_unique` UNIQUE INDEX(`po_number`),
	CONSTRAINT `purchase_orders_business_po_number_unique` UNIQUE INDEX(`business_id`,`po_number`)
);
--> statement-breakpoint
CREATE TABLE `stock_adjustment_logs` (
	`id` varchar(36) PRIMARY KEY,
	`business_id` varchar(36) NOT NULL,
	`variant_id` varchar(36) NOT NULL,
	`location_id` varchar(36),
	`location_name` varchar(255) NOT NULL,
	`previous_quantity` int NOT NULL,
	`new_quantity` int NOT NULL,
	`quantity_changed` int NOT NULL,
	`reason` enum('restock','damaged_goods','theft_shrinkage','return','physical_count_audit','correction') NOT NULL,
	`notes` text,
	`adjusted_by` varchar(36),
	`adjusted_at` timestamp NOT NULL DEFAULT (now()),
	`created_at` timestamp NOT NULL DEFAULT (now())
);
--> statement-breakpoint
CREATE TABLE `variant_inventory` (
	`id` varchar(36) PRIMARY KEY,
	`business_id` varchar(36) NOT NULL,
	`variant_id` varchar(36) NOT NULL,
	`location_id` varchar(36) NOT NULL,
	`total_stock` int NOT NULL DEFAULT 0,
	`reorder_point` int NOT NULL DEFAULT 0,
	`last_restocked` timestamp,
	`status` enum('healthy','low','critical','reorder','incoming') NOT NULL DEFAULT 'healthy',
	`created_at` timestamp NOT NULL DEFAULT (now()),
	`updated_at` timestamp NOT NULL DEFAULT (now()),
	CONSTRAINT `variant_location_unique` UNIQUE INDEX(`variant_id`,`location_id`)
);
--> statement-breakpoint
CREATE TABLE `variants` (
	`id` varchar(36) PRIMARY KEY,
	`business_id` varchar(36) NOT NULL,
	`sku` varchar(255) NOT NULL,
	`color` varchar(255) NOT NULL,
	`size` varchar(255) NOT NULL,
	`buy_price` int NOT NULL DEFAULT 0,
	`sell_price` int NOT NULL DEFAULT 0,
	`product_id` varchar(36) NOT NULL,
	`created_at` timestamp NOT NULL DEFAULT (now()),
	`updated_at` timestamp NOT NULL DEFAULT (now()),
	CONSTRAINT `sku_unique` UNIQUE INDEX(`sku`),
	CONSTRAINT `unique_variant` UNIQUE INDEX(`product_id`,`color`,`size`),
	CONSTRAINT `unique_sku` UNIQUE INDEX(`sku`,`business_id`)
);
--> statement-breakpoint
CREATE TABLE `customers` (
	`id` varchar(36) PRIMARY KEY,
	`business_id` varchar(36) NOT NULL,
	`name` varchar(255) NOT NULL,
	`slug` varchar(200),
	`email` varchar(255) NOT NULL,
	`phone` varchar(255),
	`address` varchar(255),
	`total_orders` int DEFAULT 0,
	`total_spent` int DEFAULT 0,
	`active_installments` int DEFAULT 0,
	`payment_score` int DEFAULT 0,
	`risk` enum('low','medium','high') NOT NULL DEFAULT 'low',
	`segment` enum('New','Regular','VIP') NOT NULL DEFAULT 'New',
	`joined_date` timestamp NOT NULL DEFAULT (now()),
	`last_purchase` timestamp,
	`created_at` timestamp NOT NULL DEFAULT (now()),
	`updated_at` timestamp NOT NULL DEFAULT (now()),
	CONSTRAINT `slug_unique` UNIQUE INDEX(`slug`),
	CONSTRAINT `email_unique` UNIQUE INDEX(`email`),
	CONSTRAINT `business_customer_email_idx` UNIQUE INDEX(`business_id`,`email`)
);
--> statement-breakpoint
CREATE TABLE `order_items` (
	`id` varchar(36) PRIMARY KEY,
	`business_id` varchar(36) NOT NULL,
	`variant_id` varchar(36) NOT NULL,
	`sku` varchar(255) NOT NULL,
	`name` varchar(255) NOT NULL,
	`order_id` varchar(36) NOT NULL,
	`product_id` varchar(36) NOT NULL,
	`location_id` varchar(36),
	`quantity` int NOT NULL,
	`price` int NOT NULL,
	`original_price` int,
	`created_at` timestamp NOT NULL DEFAULT (now()),
	`updated_at` timestamp NOT NULL DEFAULT (now()),
	CONSTRAINT `unique_order_item_idx` UNIQUE INDEX(`order_id`,`variant_id`)
);
--> statement-breakpoint
CREATE TABLE `orders` (
	`id` varchar(36) PRIMARY KEY,
	`business_id` varchar(36) NOT NULL,
	`customer_id` varchar(36) NOT NULL,
	`order_no` varchar(100),
	`total` int NOT NULL,
	`deposit_paid` int NOT NULL DEFAULT 0,
	`payment_status` enum('paid','partial','unpaid') NOT NULL DEFAULT 'unpaid',
	`payment_type` enum('full','installment') NOT NULL DEFAULT 'full',
	`installment_plan` varchar(255),
	`installment_start_date` timestamp,
	`status` enum('pending','processing','shipped','delivered','cancelled') NOT NULL DEFAULT 'pending',
	`start_date` timestamp,
	`shipping_address` varchar(500) NOT NULL,
	`created_at` timestamp NOT NULL DEFAULT (now()),
	`updated_at` timestamp NOT NULL DEFAULT (now()),
	CONSTRAINT `unique_order_customer_idx` UNIQUE INDEX(`customer_id`,`id`)
);
--> statement-breakpoint
CREATE TABLE `expense_items` (
	`id` varchar(36) PRIMARY KEY,
	`business_id` varchar(36) NOT NULL,
	`expense_id` varchar(36) NOT NULL,
	`name` varchar(255) NOT NULL,
	`quantity` int NOT NULL DEFAULT 1,
	`unit_cost` int NOT NULL,
	`total` int NOT NULL,
	`created_at` timestamp NOT NULL DEFAULT (now()),
	`updated_at` timestamp NOT NULL DEFAULT (now())
);
--> statement-breakpoint
CREATE TABLE `expenses` (
	`id` varchar(36) PRIMARY KEY,
	`business_id` varchar(36) NOT NULL,
	`expense_no` varchar(20) NOT NULL,
	`transaction_id` varchar(36) NOT NULL,
	`category` enum('rent','utilities','salaries','transport','supplies','inventory_purchase','marketing','equipment','maintenance','insurance','taxes','loan_repayment','other') NOT NULL,
	`vendor_name` varchar(150),
	`vendor_contact` varchar(50),
	`amount` int NOT NULL,
	`status` enum('approved','pending','rejected') NOT NULL DEFAULT 'pending',
	`receipt_url` varchar(500),
	`is_recurring` boolean DEFAULT false,
	`approved_by` varchar(36),
	`approved_at` timestamp,
	`notes` varchar(500),
	`created_at` timestamp NOT NULL DEFAULT (now()),
	`updated_at` timestamp NOT NULL DEFAULT (now()),
	CONSTRAINT `business_expense_no_idx` UNIQUE INDEX(`business_id`,`expense_no`)
);
--> statement-breakpoint
CREATE TABLE `payments` (
	`id` varchar(36) PRIMARY KEY,
	`business_id` varchar(36) NOT NULL,
	`invoice_id` varchar(36) NOT NULL,
	`amount` int NOT NULL,
	`status` enum('pending','completed','failed','reversed') NOT NULL DEFAULT 'completed',
	`received_by` varchar(36),
	`paid_at` timestamp NOT NULL DEFAULT (now()),
	`notes` varchar(500),
	`created_at` timestamp NOT NULL DEFAULT (now()),
	`updated_at` timestamp NOT NULL DEFAULT (now())
);
--> statement-breakpoint
CREATE TABLE `transactions` (
	`id` varchar(36) PRIMARY KEY,
	`business_id` varchar(36) NOT NULL,
	`payment_id` varchar(36),
	`tnx_id` varchar(50) NOT NULL,
	`currency` varchar(10) NOT NULL DEFAULT 'KES',
	`amount` int NOT NULL,
	`tnx_type` enum('sale','refund','installment','payment','deposit','withdrawal','expense','purchase','purchase_return','discount','adjustment') NOT NULL,
	`status` enum('pending','success','failed','reversed') NOT NULL DEFAULT 'success',
	`payment_method` enum('cash','mpesa','airtel_money','bank','card') NOT NULL,
	`provider` varchar(100),
	`reference` varchar(255),
	`mpesa_channel` enum('paybill','till','send_money'),
	`mpesa_receipt_number` varchar(20),
	`mpesa_phone_number` varchar(15),
	`mpesa_paybill_or_till` varchar(20),
	`merchant_request_id` varchar(50),
	`checkout_request_id` varchar(50),
	`bank_channel` enum('transfer','cheque','deposit','rtgs','eft'),
	`bank_name` varchar(100),
	`bank_account_number` varchar(50),
	`bank_branch` varchar(100),
	`bank_transaction_ref` varchar(50),
	`terminal_id` varchar(50),
	`authorization_code` varchar(50),
	`transacted_at` timestamp NOT NULL DEFAULT (now()),
	`notes` varchar(500),
	`created_at` timestamp NOT NULL DEFAULT (now()),
	`updated_at` timestamp NOT NULL DEFAULT (now()),
	CONSTRAINT `transactions_payment_unique_idx` UNIQUE INDEX(`payment_id`),
	CONSTRAINT `transactions_business_tnx_unique_idx` UNIQUE INDEX(`business_id`,`tnx_id`)
);
--> statement-breakpoint
CREATE TABLE `invoices` (
	`id` varchar(36) PRIMARY KEY,
	`business_id` varchar(36) NOT NULL,
	`order_id` varchar(36) NOT NULL,
	`invoice_number` varchar(50) NOT NULL,
	`subtotal` int NOT NULL,
	`discount` int NOT NULL DEFAULT 0,
	`tax` int NOT NULL DEFAULT 0,
	`total` int NOT NULL,
	`balance` int NOT NULL,
	`installments` int NOT NULL DEFAULT 0,
	`installment_amount` int NOT NULL DEFAULT 0,
	`status` enum('draft','issued','partially_paid','paid','overdue','cancelled') NOT NULL DEFAULT 'issued',
	`frequency` varchar(50),
	`start_date` timestamp,
	`end_date` timestamp,
	`due_date` timestamp,
	`created_at` timestamp NOT NULL DEFAULT (now()),
	`updated_at` timestamp NOT NULL DEFAULT (now()),
	CONSTRAINT `order_id_unique` UNIQUE INDEX(`order_id`),
	CONSTRAINT `invoice_number_unique` UNIQUE INDEX(`invoice_number`),
	CONSTRAINT `business_invoice_idx` UNIQUE INDEX(`business_id`,`invoice_number`)
);
--> statement-breakpoint
CREATE TABLE `permission` (
	`id` varchar(36) PRIMARY KEY,
	`name` varchar(100) NOT NULL,
	`description` varchar(255),
	`group` varchar(50) NOT NULL,
	`created_at` timestamp NOT NULL DEFAULT (now()),
	`updated_at` timestamp NOT NULL DEFAULT (now()),
	CONSTRAINT `name_unique` UNIQUE INDEX(`name`)
);
--> statement-breakpoint
CREATE TABLE `role_permission` (
	`role_id` varchar(36) NOT NULL,
	`permission_id` varchar(36) NOT NULL,
	`created_at` timestamp NOT NULL DEFAULT (now()),
	`updated_at` timestamp NOT NULL DEFAULT (now()),
	CONSTRAINT PRIMARY KEY(`role_id`,`permission_id`)
);
--> statement-breakpoint
CREATE TABLE `user` (
	`id` varchar(36) PRIMARY KEY,
	`name` varchar(255),
	`first_name` varchar(100),
	`last_name` varchar(100),
	`email` varchar(255) NOT NULL,
	`phone` varchar(20),
	`emailVerified` timestamp,
	`image` text,
	`password_hash` varchar(255),
	`business_id` varchar(36),
	`role_id` varchar(36),
	`is_active` boolean NOT NULL DEFAULT true,
	`created_at` timestamp NOT NULL DEFAULT (now()),
	`updated_at` timestamp,
	CONSTRAINT `email_unique` UNIQUE INDEX(`email`)
);
--> statement-breakpoint
CREATE TABLE `account` (
	`user_id` varchar(36) NOT NULL,
	`type` varchar(255) NOT NULL,
	`provider` varchar(255) NOT NULL,
	`providerAccountId` varchar(255) NOT NULL,
	`refresh_token` varchar(2048),
	`access_token` varchar(2048),
	`expires_at` int,
	`token_type` varchar(255),
	`scope` varchar(2048),
	`id_token` varchar(4096),
	`session_state` varchar(255),
	CONSTRAINT PRIMARY KEY(`provider`,`providerAccountId`)
);
--> statement-breakpoint
CREATE TABLE `business` (
	`id` varchar(36) PRIMARY KEY,
	`business_name` varchar(255) NOT NULL,
	`legal_name` varchar(255),
	`registration_number` varchar(100) NOT NULL,
	`tax_pin` varchar(50) NOT NULL,
	`email` varchar(255) NOT NULL,
	`phone` varchar(20) NOT NULL,
	`alternative_phone` varchar(20),
	`address` varchar(500),
	`city` varchar(100),
	`county` varchar(100),
	`country` varchar(100) DEFAULT 'Kenya',
	`currency` varchar(10) DEFAULT 'KES',
	`timezone` varchar(100) DEFAULT 'Africa/Nairobi',
	`logo_path` varchar(1000),
	`receipt_footer` varchar(500),
	`invoice_terms` varchar(1000),
	`is_active` boolean NOT NULL DEFAULT true,
	`created_at` timestamp NOT NULL DEFAULT (now()),
	`updated_at` timestamp
);
--> statement-breakpoint
CREATE TABLE `session` (
	`sessionToken` varchar(255) PRIMARY KEY,
	`user_id` varchar(36) NOT NULL,
	`expires` timestamp NOT NULL
);
--> statement-breakpoint
CREATE TABLE `verificationToken` (
	`identifier` varchar(255) NOT NULL,
	`token` varchar(255) NOT NULL,
	`expires` timestamp NOT NULL,
	CONSTRAINT PRIMARY KEY(`identifier`,`token`)
);
--> statement-breakpoint
CREATE TABLE `roles` (
	`id` varchar(36) PRIMARY KEY,
	`business_id` varchar(36),
	`name` varchar(50) NOT NULL,
	`description` varchar(255),
	`salary` int DEFAULT 0,
	`created_at` timestamp NOT NULL DEFAULT (now()),
	`updated_at` timestamp NOT NULL DEFAULT (now()),
	CONSTRAINT `unique_name_idx` UNIQUE INDEX(`business_id`,`name`)
);
--> statement-breakpoint
CREATE INDEX `expense_items_expense_idx` ON `expense_items` (`expense_id`);--> statement-breakpoint
CREATE INDEX `payments_invoice_idx` ON `payments` (`invoice_id`);--> statement-breakpoint
CREATE INDEX `payments_business_paid_at_idx` ON `payments` (`business_id`,`paid_at`);--> statement-breakpoint
CREATE INDEX `transactions_reference_idx` ON `transactions` (`reference`);--> statement-breakpoint
ALTER TABLE `product_images` ADD CONSTRAINT `product_images_business_id_business_id_fkey` FOREIGN KEY (`business_id`) REFERENCES `business`(`id`) ON DELETE CASCADE;--> statement-breakpoint
ALTER TABLE `product_images` ADD CONSTRAINT `product_images_product_id_products_id_fkey` FOREIGN KEY (`product_id`) REFERENCES `products`(`id`) ON DELETE CASCADE;--> statement-breakpoint
ALTER TABLE `products` ADD CONSTRAINT `products_business_id_business_id_fkey` FOREIGN KEY (`business_id`) REFERENCES `business`(`id`) ON DELETE CASCADE;--> statement-breakpoint
ALTER TABLE `products` ADD CONSTRAINT `products_category_id_category_id_fkey` FOREIGN KEY (`category_id`) REFERENCES `category`(`id`) ON DELETE RESTRICT;--> statement-breakpoint
ALTER TABLE `category` ADD CONSTRAINT `category_business_id_business_id_fkey` FOREIGN KEY (`business_id`) REFERENCES `business`(`id`) ON DELETE CASCADE;--> statement-breakpoint
ALTER TABLE `locations` ADD CONSTRAINT `locations_business_id_business_id_fkey` FOREIGN KEY (`business_id`) REFERENCES `business`(`id`) ON DELETE CASCADE;--> statement-breakpoint
ALTER TABLE `purchase_order_items` ADD CONSTRAINT `purchase_order_items_business_id_business_id_fkey` FOREIGN KEY (`business_id`) REFERENCES `business`(`id`) ON DELETE CASCADE;--> statement-breakpoint
ALTER TABLE `purchase_order_items` ADD CONSTRAINT `purchase_order_items_purchase_order_id_purchase_orders_id_fkey` FOREIGN KEY (`purchase_order_id`) REFERENCES `purchase_orders`(`id`) ON DELETE CASCADE;--> statement-breakpoint
ALTER TABLE `purchase_order_items` ADD CONSTRAINT `purchase_order_items_variant_id_variants_id_fkey` FOREIGN KEY (`variant_id`) REFERENCES `variants`(`id`) ON DELETE CASCADE;--> statement-breakpoint
ALTER TABLE `purchase_orders` ADD CONSTRAINT `purchase_orders_business_id_business_id_fkey` FOREIGN KEY (`business_id`) REFERENCES `business`(`id`) ON DELETE CASCADE;--> statement-breakpoint
ALTER TABLE `purchase_orders` ADD CONSTRAINT `purchase_orders_created_by_user_id_fkey` FOREIGN KEY (`created_by`) REFERENCES `user`(`id`) ON DELETE SET NULL;--> statement-breakpoint
ALTER TABLE `stock_adjustment_logs` ADD CONSTRAINT `stock_adjustment_logs_business_id_business_id_fkey` FOREIGN KEY (`business_id`) REFERENCES `business`(`id`) ON DELETE CASCADE;--> statement-breakpoint
ALTER TABLE `stock_adjustment_logs` ADD CONSTRAINT `stock_adjustment_logs_variant_id_variants_id_fkey` FOREIGN KEY (`variant_id`) REFERENCES `variants`(`id`) ON DELETE CASCADE;--> statement-breakpoint
ALTER TABLE `stock_adjustment_logs` ADD CONSTRAINT `stock_adjustment_logs_location_id_locations_id_fkey` FOREIGN KEY (`location_id`) REFERENCES `locations`(`id`) ON DELETE SET NULL;--> statement-breakpoint
ALTER TABLE `stock_adjustment_logs` ADD CONSTRAINT `stock_adjustment_logs_adjusted_by_user_id_fkey` FOREIGN KEY (`adjusted_by`) REFERENCES `user`(`id`) ON DELETE SET NULL;--> statement-breakpoint
ALTER TABLE `variant_inventory` ADD CONSTRAINT `variant_inventory_business_id_business_id_fkey` FOREIGN KEY (`business_id`) REFERENCES `business`(`id`) ON DELETE CASCADE;--> statement-breakpoint
ALTER TABLE `variant_inventory` ADD CONSTRAINT `variant_inventory_variant_id_variants_id_fkey` FOREIGN KEY (`variant_id`) REFERENCES `variants`(`id`) ON DELETE CASCADE;--> statement-breakpoint
ALTER TABLE `variant_inventory` ADD CONSTRAINT `variant_inventory_location_id_locations_id_fkey` FOREIGN KEY (`location_id`) REFERENCES `locations`(`id`) ON DELETE CASCADE;--> statement-breakpoint
ALTER TABLE `variants` ADD CONSTRAINT `variants_business_id_business_id_fkey` FOREIGN KEY (`business_id`) REFERENCES `business`(`id`) ON DELETE CASCADE;--> statement-breakpoint
ALTER TABLE `variants` ADD CONSTRAINT `variants_product_id_products_id_fkey` FOREIGN KEY (`product_id`) REFERENCES `products`(`id`) ON DELETE CASCADE;--> statement-breakpoint
ALTER TABLE `customers` ADD CONSTRAINT `customers_business_id_business_id_fkey` FOREIGN KEY (`business_id`) REFERENCES `business`(`id`) ON DELETE CASCADE;--> statement-breakpoint
ALTER TABLE `order_items` ADD CONSTRAINT `order_items_business_id_business_id_fkey` FOREIGN KEY (`business_id`) REFERENCES `business`(`id`) ON DELETE CASCADE;--> statement-breakpoint
ALTER TABLE `order_items` ADD CONSTRAINT `order_items_variant_id_variants_id_fkey` FOREIGN KEY (`variant_id`) REFERENCES `variants`(`id`) ON DELETE RESTRICT;--> statement-breakpoint
ALTER TABLE `order_items` ADD CONSTRAINT `order_items_order_id_orders_id_fkey` FOREIGN KEY (`order_id`) REFERENCES `orders`(`id`) ON DELETE CASCADE;--> statement-breakpoint
ALTER TABLE `order_items` ADD CONSTRAINT `order_items_product_id_products_id_fkey` FOREIGN KEY (`product_id`) REFERENCES `products`(`id`) ON DELETE RESTRICT;--> statement-breakpoint
ALTER TABLE `order_items` ADD CONSTRAINT `order_items_location_id_locations_id_fkey` FOREIGN KEY (`location_id`) REFERENCES `locations`(`id`) ON DELETE SET NULL;--> statement-breakpoint
ALTER TABLE `orders` ADD CONSTRAINT `orders_business_id_business_id_fkey` FOREIGN KEY (`business_id`) REFERENCES `business`(`id`) ON DELETE CASCADE;--> statement-breakpoint
ALTER TABLE `orders` ADD CONSTRAINT `orders_customer_id_customers_id_fkey` FOREIGN KEY (`customer_id`) REFERENCES `customers`(`id`) ON DELETE RESTRICT;--> statement-breakpoint
ALTER TABLE `expense_items` ADD CONSTRAINT `expense_items_business_id_business_id_fkey` FOREIGN KEY (`business_id`) REFERENCES `business`(`id`) ON DELETE CASCADE;--> statement-breakpoint
ALTER TABLE `expense_items` ADD CONSTRAINT `expense_items_expense_id_expenses_id_fkey` FOREIGN KEY (`expense_id`) REFERENCES `expenses`(`id`) ON DELETE CASCADE;--> statement-breakpoint
ALTER TABLE `expenses` ADD CONSTRAINT `expenses_business_id_business_id_fkey` FOREIGN KEY (`business_id`) REFERENCES `business`(`id`) ON DELETE CASCADE;--> statement-breakpoint
ALTER TABLE `expenses` ADD CONSTRAINT `expenses_transaction_id_transactions_id_fkey` FOREIGN KEY (`transaction_id`) REFERENCES `transactions`(`id`) ON DELETE CASCADE;--> statement-breakpoint
ALTER TABLE `payments` ADD CONSTRAINT `payments_business_id_business_id_fkey` FOREIGN KEY (`business_id`) REFERENCES `business`(`id`) ON DELETE CASCADE;--> statement-breakpoint
ALTER TABLE `transactions` ADD CONSTRAINT `transactions_business_id_business_id_fkey` FOREIGN KEY (`business_id`) REFERENCES `business`(`id`) ON DELETE CASCADE;--> statement-breakpoint
ALTER TABLE `transactions` ADD CONSTRAINT `transactions_payment_id_payments_id_fkey` FOREIGN KEY (`payment_id`) REFERENCES `payments`(`id`) ON DELETE CASCADE;--> statement-breakpoint
ALTER TABLE `invoices` ADD CONSTRAINT `invoices_business_id_business_id_fkey` FOREIGN KEY (`business_id`) REFERENCES `business`(`id`) ON DELETE CASCADE;--> statement-breakpoint
ALTER TABLE `invoices` ADD CONSTRAINT `invoices_order_id_orders_id_fkey` FOREIGN KEY (`order_id`) REFERENCES `orders`(`id`) ON DELETE RESTRICT;--> statement-breakpoint
ALTER TABLE `role_permission` ADD CONSTRAINT `role_permission_role_id_roles_id_fkey` FOREIGN KEY (`role_id`) REFERENCES `roles`(`id`) ON DELETE CASCADE;--> statement-breakpoint
ALTER TABLE `role_permission` ADD CONSTRAINT `role_permission_permission_id_permission_id_fkey` FOREIGN KEY (`permission_id`) REFERENCES `permission`(`id`) ON DELETE CASCADE;--> statement-breakpoint
ALTER TABLE `user` ADD CONSTRAINT `user_business_id_business_id_fkey` FOREIGN KEY (`business_id`) REFERENCES `business`(`id`) ON DELETE CASCADE;--> statement-breakpoint
ALTER TABLE `user` ADD CONSTRAINT `user_role_id_roles_id_fkey` FOREIGN KEY (`role_id`) REFERENCES `roles`(`id`) ON DELETE RESTRICT;--> statement-breakpoint
ALTER TABLE `account` ADD CONSTRAINT `account_user_id_user_id_fkey` FOREIGN KEY (`user_id`) REFERENCES `user`(`id`) ON DELETE CASCADE;--> statement-breakpoint
ALTER TABLE `session` ADD CONSTRAINT `session_user_id_user_id_fkey` FOREIGN KEY (`user_id`) REFERENCES `user`(`id`) ON DELETE CASCADE;--> statement-breakpoint
ALTER TABLE `roles` ADD CONSTRAINT `roles_business_id_business_id_fkey` FOREIGN KEY (`business_id`) REFERENCES `business`(`id`) ON DELETE CASCADE;