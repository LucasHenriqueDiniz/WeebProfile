CREATE TABLE `plugin_secrets` (
	`id` text PRIMARY KEY NOT NULL,
	`user_id` text NOT NULL,
	`plugin` text NOT NULL,
	`key` text NOT NULL,
	`value` text NOT NULL,
	`created_at` text NOT NULL,
	`updated_at` text NOT NULL
);
--> statement-breakpoint
CREATE INDEX `idx_essential_configs_user_id` ON `plugin_secrets` (`user_id`);--> statement-breakpoint
CREATE INDEX `idx_essential_configs_plugin_key` ON `plugin_secrets` (`plugin`,`key`);--> statement-breakpoint
CREATE UNIQUE INDEX `idx_essential_configs_user_plugin_key_unique` ON `plugin_secrets` (`user_id`,`plugin`,`key`);--> statement-breakpoint
CREATE TABLE `profiles` (
	`id` text PRIMARY KEY NOT NULL,
	`user_id` text NOT NULL,
	`username` text,
	`is_active` integer DEFAULT true NOT NULL,
	`created_at` text NOT NULL,
	`updated_at` text NOT NULL
);
--> statement-breakpoint
CREATE UNIQUE INDEX `profiles_user_id_unique` ON `profiles` (`user_id`);--> statement-breakpoint
CREATE INDEX `idx_profiles_user_id` ON `profiles` (`user_id`);--> statement-breakpoint
CREATE INDEX `idx_profiles_username` ON `profiles` (`username`);--> statement-breakpoint
CREATE INDEX `idx_profiles_active` ON `profiles` (`is_active`);--> statement-breakpoint
CREATE TABLE `svgs` (
	`id` text PRIMARY KEY NOT NULL,
	`user_id` text NOT NULL,
	`slug` text NOT NULL,
	`name` text NOT NULL,
	`style` text DEFAULT 'default' NOT NULL,
	`size` text DEFAULT 'half' NOT NULL,
	`theme` text DEFAULT 'default',
	`custom_css` text,
	`plugins_order` text,
	`plugins_config` text NOT NULL,
	`ui_config` text NOT NULL,
	`storage_path` text,
	`storage_url` text,
	`status` text DEFAULT 'pending' NOT NULL,
	`force_regenerate` integer DEFAULT false NOT NULL,
	`data_hash` text,
	`last_generated_at` text,
	`updated_at` text NOT NULL,
	`next_regeneration_at` text,
	`last_payload_hash` text,
	`fail_count` integer DEFAULT 0 NOT NULL,
	`last_error` text,
	`is_paused` integer DEFAULT false NOT NULL,
	`created_at` text NOT NULL
);
--> statement-breakpoint
CREATE INDEX `idx_svgs_user_id` ON `svgs` (`user_id`);--> statement-breakpoint
CREATE INDEX `idx_svgs_slug` ON `svgs` (`slug`);--> statement-breakpoint
CREATE INDEX `idx_svgs_user_id_slug` ON `svgs` (`user_id`,`slug`);--> statement-breakpoint
CREATE INDEX `idx_svgs_status` ON `svgs` (`status`);--> statement-breakpoint
CREATE INDEX `idx_svgs_force_regenerate` ON `svgs` (`force_regenerate`);--> statement-breakpoint
CREATE TABLE `template_likes` (
	`id` text PRIMARY KEY NOT NULL,
	`user_id` text NOT NULL,
	`template_id` text NOT NULL,
	`created_at` text NOT NULL,
	FOREIGN KEY (`template_id`) REFERENCES `templates`(`id`) ON UPDATE no action ON DELETE cascade
);
--> statement-breakpoint
CREATE INDEX `idx_template_likes_user_id` ON `template_likes` (`user_id`);--> statement-breakpoint
CREATE INDEX `idx_template_likes_template_id` ON `template_likes` (`template_id`);--> statement-breakpoint
CREATE UNIQUE INDEX `idx_template_likes_user_template_unique` ON `template_likes` (`user_id`,`template_id`);--> statement-breakpoint
CREATE TABLE `templates` (
	`id` text PRIMARY KEY NOT NULL,
	`user_id` text NOT NULL,
	`name` text NOT NULL,
	`description` text,
	`svg_id` text,
	`style` text DEFAULT 'default' NOT NULL,
	`size` text DEFAULT 'half' NOT NULL,
	`theme` text DEFAULT 'default',
	`custom_css` text,
	`plugins_order` text,
	`plugins_config` text NOT NULL,
	`ui_config` text NOT NULL,
	`is_public` integer DEFAULT false NOT NULL,
	`created_at` text NOT NULL
);
--> statement-breakpoint
CREATE INDEX `idx_templates_user_id` ON `templates` (`user_id`);--> statement-breakpoint
CREATE INDEX `idx_templates_svg_id` ON `templates` (`svg_id`);--> statement-breakpoint
CREATE INDEX `idx_templates_public` ON `templates` (`is_public`);