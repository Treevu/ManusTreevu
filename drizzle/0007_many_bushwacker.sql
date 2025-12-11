CREATE TABLE `department_alert_history` (
	`id` int AUTO_INCREMENT NOT NULL,
	`departmentId` int NOT NULL,
	`alertType` enum('fwi_low','high_risk_exceeded') NOT NULL,
	`previousValue` int NOT NULL,
	`currentValue` int NOT NULL,
	`threshold` int NOT NULL,
	`notifiedUsers` text,
	`resolvedAt` timestamp,
	`createdAt` timestamp NOT NULL DEFAULT (now()),
	CONSTRAINT `department_alert_history_id` PRIMARY KEY(`id`)
);
--> statement-breakpoint
CREATE TABLE `department_alert_thresholds` (
	`id` int AUTO_INCREMENT NOT NULL,
	`departmentId` int NOT NULL,
	`fwiThreshold` int NOT NULL DEFAULT 50,
	`highRiskThreshold` int NOT NULL DEFAULT 3,
	`isEnabled` boolean NOT NULL DEFAULT true,
	`notifyAdmins` boolean NOT NULL DEFAULT true,
	`notifyB2BAdmin` boolean NOT NULL DEFAULT true,
	`createdAt` timestamp NOT NULL DEFAULT (now()),
	`updatedAt` timestamp NOT NULL DEFAULT (now()) ON UPDATE CURRENT_TIMESTAMP,
	CONSTRAINT `department_alert_thresholds_id` PRIMARY KEY(`id`)
);
