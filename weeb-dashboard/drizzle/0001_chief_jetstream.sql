ALTER TABLE `svgs` ADD `entity_type` text DEFAULT 'profile' NOT NULL;--> statement-breakpoint
ALTER TABLE `svgs` ADD `artifact_type` text DEFAULT 'profile_card' NOT NULL;--> statement-breakpoint
ALTER TABLE `svgs` ADD `variant` text DEFAULT 'default' NOT NULL;--> statement-breakpoint
ALTER TABLE `templates` ADD `entity_type` text DEFAULT 'profile' NOT NULL;--> statement-breakpoint
ALTER TABLE `templates` ADD `artifact_type` text DEFAULT 'profile_card' NOT NULL;--> statement-breakpoint
ALTER TABLE `templates` ADD `variant` text DEFAULT 'default' NOT NULL;