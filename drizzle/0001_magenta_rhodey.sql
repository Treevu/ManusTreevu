CREATE TABLE `audit_logs` (
	`id` int AUTO_INCREMENT NOT NULL,
	`userId` int,
	`action` varchar(100) NOT NULL,
	`resource` varchar(100),
	`resourceId` int,
	`details` text,
	`ipAddress` varchar(45),
	`userAgent` text,
	`success` boolean DEFAULT true,
	`createdAt` timestamp NOT NULL DEFAULT (now()),
	CONSTRAINT `audit_logs_id` PRIMARY KEY(`id`)
);
--> statement-breakpoint
CREATE TABLE `departments` (
	`id` int AUTO_INCREMENT NOT NULL,
	`name` varchar(100) NOT NULL,
	`companyId` int,
	`managerId` int,
	`employeeCount` int DEFAULT 0,
	`avgFwiScore` int DEFAULT 50,
	`treePointsBudget` int DEFAULT 10000,
	`treePointsUsed` int DEFAULT 0,
	`createdAt` timestamp NOT NULL DEFAULT (now()),
	`updatedAt` timestamp NOT NULL DEFAULT (now()) ON UPDATE CURRENT_TIMESTAMP,
	CONSTRAINT `departments_id` PRIMARY KEY(`id`)
);
--> statement-breakpoint
CREATE TABLE `employee_risk_analysis` (
	`id` int AUTO_INCREMENT NOT NULL,
	`userId` int NOT NULL,
	`departmentId` int,
	`absenteeismRisk` enum('low','medium','high','critical') NOT NULL DEFAULT 'low',
	`turnoverPropensity` int DEFAULT 0,
	`ewaFrequency` int DEFAULT 0,
	`lastFwiScore` int DEFAULT 50,
	`tenure` int DEFAULT 0,
	`age` int,
	`projectedLoss` int DEFAULT 0,
	`lastAnalysisDate` timestamp NOT NULL DEFAULT (now()),
	`createdAt` timestamp NOT NULL DEFAULT (now()),
	`updatedAt` timestamp NOT NULL DEFAULT (now()) ON UPDATE CURRENT_TIMESTAMP,
	CONSTRAINT `employee_risk_analysis_id` PRIMARY KEY(`id`),
	CONSTRAINT `employee_risk_analysis_userId_unique` UNIQUE(`userId`)
);
--> statement-breakpoint
CREATE TABLE `ewa_requests` (
	`id` int AUTO_INCREMENT NOT NULL,
	`userId` int NOT NULL,
	`amount` int NOT NULL,
	`fee` int NOT NULL,
	`status` enum('pending_approval','processing_transfer','disbursed','rejected') NOT NULL DEFAULT 'pending_approval',
	`rejectionReason` text,
	`approvedBy` int,
	`daysWorked` int NOT NULL,
	`monthlyIncome` int NOT NULL,
	`fwiScoreAtRequest` int NOT NULL,
	`estimatedArrival` timestamp,
	`disbursedAt` timestamp,
	`createdAt` timestamp NOT NULL DEFAULT (now()),
	`updatedAt` timestamp NOT NULL DEFAULT (now()) ON UPDATE CURRENT_TIMESTAMP,
	CONSTRAINT `ewa_requests_id` PRIMARY KEY(`id`)
);
--> statement-breakpoint
CREATE TABLE `financial_goals` (
	`id` int AUTO_INCREMENT NOT NULL,
	`userId` int NOT NULL,
	`name` varchar(100) NOT NULL,
	`targetAmount` int NOT NULL,
	`currentAmount` int NOT NULL DEFAULT 0,
	`category` enum('emergency','vacation','purchase','investment','other') NOT NULL DEFAULT 'other',
	`deadline` timestamp,
	`isPriority` boolean DEFAULT false,
	`isCompleted` boolean DEFAULT false,
	`createdAt` timestamp NOT NULL DEFAULT (now()),
	`updatedAt` timestamp NOT NULL DEFAULT (now()) ON UPDATE CURRENT_TIMESTAMP,
	CONSTRAINT `financial_goals_id` PRIMARY KEY(`id`)
);
--> statement-breakpoint
CREATE TABLE `fwi_score_history` (
	`id` int AUTO_INCREMENT NOT NULL,
	`userId` int NOT NULL,
	`score` int NOT NULL,
	`factors` text,
	`recordedAt` timestamp NOT NULL DEFAULT (now()),
	CONSTRAINT `fwi_score_history_id` PRIMARY KEY(`id`)
);
--> statement-breakpoint
CREATE TABLE `market_offers` (
	`id` int AUTO_INCREMENT NOT NULL,
	`merchantId` int NOT NULL,
	`title` varchar(200) NOT NULL,
	`description` text,
	`costPoints` int NOT NULL,
	`discountValue` varchar(50),
	`category` enum('financial','lifestyle','emergency','investment') NOT NULL DEFAULT 'lifestyle',
	`targetFwiSegment` enum('low','mid','high','all') NOT NULL DEFAULT 'all',
	`origin` enum('corporate','global') NOT NULL DEFAULT 'global',
	`isActive` boolean DEFAULT true,
	`totalRedemptions` int DEFAULT 0,
	`totalConversions` int DEFAULT 0,
	`createdAt` timestamp NOT NULL DEFAULT (now()),
	`updatedAt` timestamp NOT NULL DEFAULT (now()) ON UPDATE CURRENT_TIMESTAMP,
	CONSTRAINT `market_offers_id` PRIMARY KEY(`id`)
);
--> statement-breakpoint
CREATE TABLE `security_sessions` (
	`id` int AUTO_INCREMENT NOT NULL,
	`userId` int NOT NULL,
	`sessionToken` varchar(128) NOT NULL,
	`ipAddress` varchar(45),
	`userAgent` text,
	`deviceFingerprint` varchar(128),
	`isActive` boolean DEFAULT true,
	`lastActivity` timestamp NOT NULL DEFAULT (now()),
	`expiresAt` timestamp NOT NULL,
	`createdAt` timestamp NOT NULL DEFAULT (now()),
	CONSTRAINT `security_sessions_id` PRIMARY KEY(`id`)
);
--> statement-breakpoint
CREATE TABLE `transactions` (
	`id` int AUTO_INCREMENT NOT NULL,
	`userId` int NOT NULL,
	`merchant` varchar(200) NOT NULL,
	`amount` int NOT NULL,
	`category` enum('food','transport','entertainment','services','health','shopping','other') NOT NULL DEFAULT 'other',
	`isDiscretionary` boolean DEFAULT true,
	`aiConfidence` int,
	`description` text,
	`transactionDate` timestamp NOT NULL DEFAULT (now()),
	`createdAt` timestamp NOT NULL DEFAULT (now()),
	CONSTRAINT `transactions_id` PRIMARY KEY(`id`)
);
--> statement-breakpoint
CREATE TABLE `tree_points_transactions` (
	`id` int AUTO_INCREMENT NOT NULL,
	`userId` int NOT NULL,
	`amount` int NOT NULL,
	`type` enum('earned','redeemed','issued','expired','bonus') NOT NULL,
	`reason` varchar(200),
	`offerId` int,
	`issuedBy` int,
	`departmentId` int,
	`createdAt` timestamp NOT NULL DEFAULT (now()),
	CONSTRAINT `tree_points_transactions_id` PRIMARY KEY(`id`)
);
--> statement-breakpoint
ALTER TABLE `users` MODIFY COLUMN `role` enum('admin','employee','merchant','b2b_admin') NOT NULL DEFAULT 'employee';--> statement-breakpoint
ALTER TABLE `users` ADD `departmentId` int;--> statement-breakpoint
ALTER TABLE `users` ADD `monthlyIncome` int DEFAULT 0;--> statement-breakpoint
ALTER TABLE `users` ADD `fwiScore` int DEFAULT 50;--> statement-breakpoint
ALTER TABLE `users` ADD `treePoints` int DEFAULT 0;--> statement-breakpoint
ALTER TABLE `users` ADD `streakDays` int DEFAULT 0;--> statement-breakpoint
ALTER TABLE `users` ADD `level` int DEFAULT 1;--> statement-breakpoint
ALTER TABLE `users` ADD `workModality` enum('remote','hybrid','onsite') DEFAULT 'onsite';--> statement-breakpoint
ALTER TABLE `users` ADD `merchantLevel` enum('bronze','silver','gold');--> statement-breakpoint
ALTER TABLE `users` ADD `merchantRole` enum('admin','editor','viewer');--> statement-breakpoint
ALTER TABLE `users` ADD `status` enum('active','pending','suspended') DEFAULT 'active' NOT NULL;