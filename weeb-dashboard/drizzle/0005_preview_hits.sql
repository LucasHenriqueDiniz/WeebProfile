CREATE TABLE `preview_hits` (
	`bucket` text PRIMARY KEY NOT NULL,
	`window_start` text NOT NULL,
	`count` integer NOT NULL
);
--> statement-breakpoint
CREATE INDEX `idx_preview_hits_window_start` ON `preview_hits` (`window_start`);