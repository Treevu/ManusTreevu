CREATE TABLE `email_queue` (
	`id` int AUTO_INCREMENT NOT NULL,
	`userId` int NOT NULL,
	`toEmail` varchar(320) NOT NULL,
	`subject` varchar(500) NOT NULL,
	`templateType` enum('ewa_approved','ewa_rejected','ewa_disbursed','treepoints_received','goal_completed','fwi_improved','fwi_alert','security_alert','welcome','weekly_summary') NOT NULL,
	`templateData` text,
	`status` enum('pending','sent','failed') NOT NULL DEFAULT 'pending',
	`attempts` int NOT NULL DEFAULT 0,
	`lastError` text,
	`sentAt` timestamp,
	`createdAt` timestamp NOT NULL DEFAULT (now()),
	CONSTRAINT `email_queue_id` PRIMARY KEY(`id`)
);
--> statement-breakpoint
CREATE TABLE `push_subscriptions` (
	`id` int AUTO_INCREMENT NOT NULL,
	`userId` int NOT NULL,
	`endpoint` text NOT NULL,
	`p256dh` text NOT NULL,
	`auth` text NOT NULL,
	`userAgent` text,
	`isActive` boolean NOT NULL DEFAULT true,
	`createdAt` timestamp NOT NULL DEFAULT (now()),
	`lastUsedAt` timestamp NOT NULL DEFAULT (now()),
	CONSTRAINT `push_subscriptions_id` PRIMARY KEY(`id`)
);
