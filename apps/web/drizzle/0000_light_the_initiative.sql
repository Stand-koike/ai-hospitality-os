CREATE TABLE `guests` (
	`id` text PRIMARY KEY NOT NULL,
	`display_name` text NOT NULL,
	`contact_email` text,
	`contact_phone` text,
	`created_at` text NOT NULL,
	`updated_at` text NOT NULL
);
--> statement-breakpoint
CREATE TABLE `reservations` (
	`id` text PRIMARY KEY NOT NULL,
	`external_reservation_id` text NOT NULL,
	`booker_name` text NOT NULL,
	`check_in_date` text NOT NULL,
	`check_out_date` text NOT NULL,
	`contact_email` text,
	`contact_phone` text,
	`guest_name_kana` text,
	`guest_count` integer,
	`room_label` text,
	`source` text,
	`booked_at` text,
	`notes` text,
	`import_source` text NOT NULL,
	`imported_at` text NOT NULL,
	`import_batch_id` text,
	`guest_resolution_status` text NOT NULL,
	`guest_id` text,
	FOREIGN KEY (`guest_id`) REFERENCES `guests`(`id`) ON UPDATE no action ON DELETE no action
);
--> statement-breakpoint
CREATE UNIQUE INDEX `reservations_external_id_unique` ON `reservations` (`external_reservation_id`);--> statement-breakpoint
CREATE INDEX `reservations_guest_id_idx` ON `reservations` (`guest_id`);--> statement-breakpoint
CREATE TABLE `stays` (
	`id` text PRIMARY KEY NOT NULL,
	`guest_id` text NOT NULL,
	`reservation_id` text NOT NULL,
	`check_in_date` text NOT NULL,
	`check_out_date` text NOT NULL,
	`status` text NOT NULL,
	`created_at` text NOT NULL,
	`updated_at` text NOT NULL,
	FOREIGN KEY (`guest_id`) REFERENCES `guests`(`id`) ON UPDATE no action ON DELETE no action,
	FOREIGN KEY (`reservation_id`) REFERENCES `reservations`(`id`) ON UPDATE no action ON DELETE no action
);
--> statement-breakpoint
CREATE INDEX `stays_guest_id_idx` ON `stays` (`guest_id`);--> statement-breakpoint
CREATE INDEX `stays_reservation_id_idx` ON `stays` (`reservation_id`);--> statement-breakpoint
CREATE TABLE `timeline_entries` (
	`id` text PRIMARY KEY NOT NULL,
	`guest_id` text NOT NULL,
	`occurred_at` text NOT NULL,
	`recorded_at` text NOT NULL,
	`entry_type` text NOT NULL,
	`body` text NOT NULL,
	`created_by` text,
	`related_reservation_id` text,
	FOREIGN KEY (`guest_id`) REFERENCES `guests`(`id`) ON UPDATE no action ON DELETE no action,
	FOREIGN KEY (`related_reservation_id`) REFERENCES `reservations`(`id`) ON UPDATE no action ON DELETE no action
);
--> statement-breakpoint
CREATE INDEX `timeline_guest_id_idx` ON `timeline_entries` (`guest_id`);