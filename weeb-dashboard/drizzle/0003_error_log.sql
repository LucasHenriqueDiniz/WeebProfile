CREATE TABLE `error_log` (
	`id` integer PRIMARY KEY AUTOINCREMENT NOT NULL,
	`created_at` text NOT NULL,
	`method` text NOT NULL,
	`path` text NOT NULL,
	`status` integer NOT NULL,
	`message` text NOT NULL,
	`stack` text
);
--> statement-breakpoint
CREATE INDEX `idx_error_log_created_at` ON `error_log` (`created_at`);