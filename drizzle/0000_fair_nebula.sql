CREATE TABLE `contracts` (
	`id` integer PRIMARY KEY AUTOINCREMENT NOT NULL,
	`code` text NOT NULL,
	`quote_id` integer,
	`customer` text NOT NULL,
	`project` text NOT NULL,
	`installation_address` text DEFAULT '' NOT NULL,
	`value` integer NOT NULL,
	`signed_date` text NOT NULL,
	`delivery_days` integer DEFAULT 50 NOT NULL,
	`installation_days` integer DEFAULT 20 NOT NULL,
	`handover_days` integer DEFAULT 10 NOT NULL,
	`warranty_months` integer DEFAULT 18 NOT NULL,
	`maintenance_months` integer DEFAULT 18 NOT NULL,
	`stage` text DEFAULT 'Chuẩn bị' NOT NULL,
	`status` text DEFAULT 'Đang thực hiện' NOT NULL,
	`created_at` text DEFAULT CURRENT_TIMESTAMP NOT NULL,
	FOREIGN KEY (`quote_id`) REFERENCES `quotes`(`id`) ON UPDATE no action ON DELETE no action
);
--> statement-breakpoint
CREATE UNIQUE INDEX `contracts_code_unique` ON `contracts` (`code`);--> statement-breakpoint
CREATE TABLE `payment_schedules` (
	`id` integer PRIMARY KEY AUTOINCREMENT NOT NULL,
	`contract_id` integer NOT NULL,
	`installment` integer NOT NULL,
	`milestone` text NOT NULL,
	`due_date` text NOT NULL,
	`amount` integer NOT NULL,
	`paid_amount` integer DEFAULT 0 NOT NULL,
	`status` text DEFAULT 'Chưa thu' NOT NULL,
	FOREIGN KEY (`contract_id`) REFERENCES `contracts`(`id`) ON UPDATE no action ON DELETE no action
);
--> statement-breakpoint
CREATE TABLE `payments` (
	`id` integer PRIMARY KEY AUTOINCREMENT NOT NULL,
	`contract_id` integer NOT NULL,
	`schedule_id` integer,
	`amount` integer NOT NULL,
	`paid_at` text NOT NULL,
	`method` text DEFAULT 'Chuyển khoản' NOT NULL,
	`reference` text DEFAULT '' NOT NULL,
	`confirmed_by` text DEFAULT '' NOT NULL,
	`created_at` text DEFAULT CURRENT_TIMESTAMP NOT NULL,
	FOREIGN KEY (`contract_id`) REFERENCES `contracts`(`id`) ON UPDATE no action ON DELETE no action,
	FOREIGN KEY (`schedule_id`) REFERENCES `payment_schedules`(`id`) ON UPDATE no action ON DELETE no action
);
--> statement-breakpoint
CREATE TABLE `quotes` (
	`id` integer PRIMARY KEY AUTOINCREMENT NOT NULL,
	`code` text NOT NULL,
	`customer` text NOT NULL,
	`contact` text DEFAULT '' NOT NULL,
	`phone` text DEFAULT '' NOT NULL,
	`project` text NOT NULL,
	`address` text DEFAULT '' NOT NULL,
	`lift_type` text NOT NULL,
	`brand` text DEFAULT '' NOT NULL,
	`capacity` integer NOT NULL,
	`stops` integer NOT NULL,
	`speed` real DEFAULT 1 NOT NULL,
	`quantity` integer DEFAULT 1 NOT NULL,
	`unit_price` integer NOT NULL,
	`discount` real DEFAULT 0 NOT NULL,
	`vat` real DEFAULT 8 NOT NULL,
	`value` integer NOT NULL,
	`validity_days` integer DEFAULT 15 NOT NULL,
	`status` text DEFAULT 'Bản nháp' NOT NULL,
	`created_at` text DEFAULT CURRENT_TIMESTAMP NOT NULL,
	`updated_at` text DEFAULT CURRENT_TIMESTAMP NOT NULL
);
--> statement-breakpoint
CREATE UNIQUE INDEX `quotes_code_unique` ON `quotes` (`code`);