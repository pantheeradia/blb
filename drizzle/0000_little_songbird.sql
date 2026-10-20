CREATE TABLE `admin_users` (
	`id` integer PRIMARY KEY AUTOINCREMENT NOT NULL,
	`email` text,
	`password_hash` text,
	`reset_token_hash` text,
	`reset_token_expires_at` text,
	`updated_at` text DEFAULT (datetime('now')) NOT NULL,
	`created_at` text DEFAULT (datetime('now')) NOT NULL
);
--> statement-breakpoint
CREATE TABLE `coupons` (
	`id` integer PRIMARY KEY AUTOINCREMENT NOT NULL,
	`code` text NOT NULL,
	`type` text DEFAULT 'percentage' NOT NULL,
	`amount` real NOT NULL,
	`min_order_amount` real DEFAULT 0 NOT NULL,
	`max_uses` integer,
	`uses_count` integer DEFAULT 0 NOT NULL,
	`expires_at` text,
	`active` integer DEFAULT true NOT NULL,
	`referenced_to` text,
	`created_at` text DEFAULT (datetime('now')) NOT NULL
);
--> statement-breakpoint
CREATE UNIQUE INDEX `coupons_code_unique` ON `coupons` (`code`);--> statement-breakpoint
CREATE TABLE `customers` (
	`id` integer PRIMARY KEY AUTOINCREMENT NOT NULL,
	`name` text NOT NULL,
	`email` text NOT NULL,
	`phone` text DEFAULT '' NOT NULL,
	`address` text DEFAULT '' NOT NULL,
	`city` text DEFAULT '' NOT NULL,
	`state` text DEFAULT '' NOT NULL,
	`pincode` text DEFAULT '' NOT NULL,
	`order_count` integer DEFAULT 1 NOT NULL,
	`total_spend` real DEFAULT 0 NOT NULL,
	`last_order_at` text,
	`created_at` text DEFAULT (datetime('now')) NOT NULL
);
--> statement-breakpoint
CREATE UNIQUE INDEX `customers_email_unique` ON `customers` (`email`);--> statement-breakpoint
CREATE INDEX `idx_customers_last_order_at` ON `customers` (`last_order_at`);--> statement-breakpoint
CREATE TABLE `order_items` (
	`id` integer PRIMARY KEY AUTOINCREMENT NOT NULL,
	`order_id` text NOT NULL,
	`product_id` integer NOT NULL,
	`product_name` text NOT NULL,
	`price` real NOT NULL,
	`quantity` integer NOT NULL,
	`selected_weight` text,
	`brewing_equipment` text,
	FOREIGN KEY (`order_id`) REFERENCES `orders`(`id`) ON UPDATE no action ON DELETE cascade
);
--> statement-breakpoint
CREATE INDEX `idx_order_items_order_id` ON `order_items` (`order_id`);--> statement-breakpoint
CREATE TABLE `order_notes` (
	`id` integer PRIMARY KEY AUTOINCREMENT NOT NULL,
	`order_id` text NOT NULL,
	`note` text NOT NULL,
	`type` text DEFAULT 'internal' NOT NULL,
	`created_at` text DEFAULT (datetime('now')) NOT NULL,
	FOREIGN KEY (`order_id`) REFERENCES `orders`(`id`) ON UPDATE no action ON DELETE cascade
);
--> statement-breakpoint
CREATE INDEX `idx_order_notes_order_id` ON `order_notes` (`order_id`);--> statement-breakpoint
CREATE TABLE `orders` (
	`id` text PRIMARY KEY NOT NULL,
	`payment_id` text NOT NULL,
	`status` text DEFAULT 'processing' NOT NULL,
	`customer_name` text NOT NULL,
	`customer_email` text NOT NULL,
	`customer_phone` text DEFAULT '' NOT NULL,
	`address` text NOT NULL,
	`city` text NOT NULL,
	`state` text DEFAULT '' NOT NULL,
	`pincode` text NOT NULL,
	`total` real NOT NULL,
	`discount` real DEFAULT 0 NOT NULL,
	`coupon_code` text,
	`tracking_ref` text,
	`tracking_vendor` text,
	`invoice_number` text,
	`order_number` text,
	`source_type` text,
	`utm_source` text,
	`utm_medium` text,
	`utm_campaign` text,
	`created_at` text DEFAULT (datetime('now')) NOT NULL,
	`updated_at` text DEFAULT (datetime('now')) NOT NULL
);
--> statement-breakpoint
CREATE INDEX `idx_orders_created_at` ON `orders` (`created_at`);--> statement-breakpoint
CREATE INDEX `idx_orders_status` ON `orders` (`status`);--> statement-breakpoint
CREATE INDEX `idx_orders_invoice_number` ON `orders` (`invoice_number`);--> statement-breakpoint
CREATE INDEX `idx_orders_order_number` ON `orders` (`order_number`);--> statement-breakpoint
CREATE TABLE `pending_orders` (
	`id` text PRIMARY KEY NOT NULL,
	`amount_paise` integer NOT NULL,
	`discount` real DEFAULT 0 NOT NULL,
	`coupon_code` text,
	`items_json` text NOT NULL,
	`customer_json` text,
	`attribution_json` text,
	`created_at` text DEFAULT (datetime('now')) NOT NULL
);
--> statement-breakpoint
CREATE TABLE `products` (
	`id` integer PRIMARY KEY AUTOINCREMENT NOT NULL,
	`slug` text NOT NULL,
	`name` text NOT NULL,
	`short_description` text DEFAULT '' NOT NULL,
	`description` text DEFAULT '' NOT NULL,
	`category` text NOT NULL,
	`price` real NOT NULL,
	`regular_price` real,
	`images` text DEFAULT '[]' NOT NULL,
	`tags` text DEFAULT '[]' NOT NULL,
	`in_stock` integer DEFAULT true NOT NULL,
	`weight` text,
	`weight_options` text DEFAULT '[]' NOT NULL,
	`brewing_equipment_options` text DEFAULT '[]' NOT NULL,
	`notes` text DEFAULT '[]' NOT NULL,
	`roast` text,
	`blend` text,
	`featured` integer DEFAULT false NOT NULL,
	`visible` integer DEFAULT true NOT NULL,
	`ean` text,
	`created_at` text DEFAULT (datetime('now')) NOT NULL,
	`updated_at` text DEFAULT (datetime('now')) NOT NULL
);
--> statement-breakpoint
CREATE UNIQUE INDEX `products_slug_unique` ON `products` (`slug`);--> statement-breakpoint
CREATE INDEX `idx_products_category` ON `products` (`category`);--> statement-breakpoint
CREATE INDEX `idx_products_featured` ON `products` (`featured`);--> statement-breakpoint
CREATE TABLE `settings` (
	`key` text PRIMARY KEY NOT NULL,
	`value` text NOT NULL,
	`label` text DEFAULT '' NOT NULL,
	`updated_at` text DEFAULT (datetime('now')) NOT NULL
);
