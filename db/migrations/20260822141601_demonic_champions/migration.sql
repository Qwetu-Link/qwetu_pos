CREATE TABLE `reviews` (
	`id` varchar(36) PRIMARY KEY,
	`business_id` varchar(36) NOT NULL,
	`product_id` varchar(36) NOT NULL,
	`customer_id` varchar(36) NOT NULL,
	`rating` tinyint NOT NULL,
	`title` varchar(255),
	`review` text NOT NULL,
	`would_recommend` boolean NOT NULL DEFAULT true,
	`created_at` timestamp NOT NULL DEFAULT (now()),
	`updated_at` timestamp NOT NULL DEFAULT (now()),
	CONSTRAINT `customer_product_review_unique` UNIQUE INDEX(`customer_id`,`product_id`),
	CONSTRAINT `reviews_business_id_business_id_fkey` FOREIGN KEY (`business_id`) REFERENCES `business`(`id`),
	CONSTRAINT `reviews_product_id_products_id_fkey` FOREIGN KEY (`product_id`) REFERENCES `products`(`id`),
	CONSTRAINT `reviews_customer_id_customers_id_fkey` FOREIGN KEY (`customer_id`) REFERENCES `customers`(`id`)
);
--> statement-breakpoint
CREATE INDEX `reviews_product_id_idx` ON `reviews` (`product_id`);--> statement-breakpoint
CREATE INDEX `reviews_customer_id_idx` ON `reviews` (`customer_id`);--> statement-breakpoint
CREATE INDEX `reviews_business_id_idx` ON `reviews` (`business_id`);