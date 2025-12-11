CREATE TABLE `mfa_settings` (
	`id` int AUTO_INCREMENT NOT NULL,
	`userId` int NOT NULL,
	`secret` varchar(64) NOT NULL,
	`enabled` boolean NOT NULL DEFAULT false,
	`verifiedAt` timestamp,
	`backupCodes` text,
	`backupCodesUsed` int NOT NULL DEFAULT 0,
	`lastUsedAt` timestamp,
	`createdAt` timestamp NOT NULL DEFAULT (now()),
	`updatedAt` timestamp NOT NULL DEFAULT (now()) ON UPDATE CURRENT_TIMESTAMP,
	CONSTRAINT `mfa_settings_id` PRIMARY KEY(`id`),
	CONSTRAINT `mfa_settings_userId_unique` UNIQUE(`userId`)
);
--> statement-breakpoint
CREATE TABLE `pulse_questions` (
	`id` int AUTO_INCREMENT NOT NULL,
	`surveyId` int NOT NULL,
	`questionText` text NOT NULL,
	`questionType` enum('scale','emoji','text','choice') NOT NULL DEFAULT 'scale',
	`category` enum('financial_stress','work_life_balance','job_satisfaction','financial_confidence','savings_habits','overall_wellbeing') NOT NULL DEFAULT 'overall_wellbeing',
	`options` text,
	`orderIndex` int NOT NULL DEFAULT 0,
	`isRequired` boolean NOT NULL DEFAULT true,
	`createdAt` timestamp NOT NULL DEFAULT (now()),
	CONSTRAINT `pulse_questions_id` PRIMARY KEY(`id`)
);
--> statement-breakpoint
CREATE TABLE `pulse_responses` (
	`id` int AUTO_INCREMENT NOT NULL,
	`surveyId` int NOT NULL,
	`questionId` int NOT NULL,
	`userId` int NOT NULL,
	`responseValue` int,
	`responseText` text,
	`responseChoice` varchar(200),
	`submittedAt` timestamp NOT NULL DEFAULT (now()),
	CONSTRAINT `pulse_responses_id` PRIMARY KEY(`id`)
);
--> statement-breakpoint
CREATE TABLE `pulse_survey_assignments` (
	`id` int AUTO_INCREMENT NOT NULL,
	`surveyId` int NOT NULL,
	`userId` int NOT NULL,
	`assignedAt` timestamp NOT NULL DEFAULT (now()),
	`dueAt` timestamp,
	`completedAt` timestamp,
	`reminderSentAt` timestamp,
	CONSTRAINT `pulse_survey_assignments_id` PRIMARY KEY(`id`)
);
--> statement-breakpoint
CREATE TABLE `pulse_surveys` (
	`id` int AUTO_INCREMENT NOT NULL,
	`title` varchar(200) NOT NULL,
	`description` text,
	`organizationId` int,
	`frequency` enum('weekly','biweekly','monthly') NOT NULL DEFAULT 'weekly',
	`isActive` boolean NOT NULL DEFAULT true,
	`startsAt` timestamp,
	`endsAt` timestamp,
	`createdBy` int NOT NULL,
	`createdAt` timestamp NOT NULL DEFAULT (now()),
	`updatedAt` timestamp NOT NULL DEFAULT (now()) ON UPDATE CURRENT_TIMESTAMP,
	CONSTRAINT `pulse_surveys_id` PRIMARY KEY(`id`)
);
