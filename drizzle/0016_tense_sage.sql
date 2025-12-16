CREATE TABLE `executive_dashboard_metrics` (
	`id` int AUTO_INCREMENT NOT NULL,
	`departmentId` int,
	`date` varchar(10) NOT NULL,
	`totalEmployees` int NOT NULL,
	`avgFwiScore` int NOT NULL,
	`employeesAtRisk` int NOT NULL,
	`riskPercentage` decimal(5,2) NOT NULL,
	`churnRiskAverage` decimal(5,4) NOT NULL,
	`predictedChurnCount` int DEFAULT 0,
	`activeInterventions` int DEFAULT 0,
	`completedInterventions` int DEFAULT 0,
	`interventionSuccessRate` decimal(5,2) DEFAULT 0,
	`estimatedROI` int DEFAULT 0,
	`totalTreePointsIssued` int DEFAULT 0,
	`totalTreePointsRedeemed` int DEFAULT 0,
	`ewaRequestsCount` int DEFAULT 0,
	`ewaApprovalRate` decimal(5,2) DEFAULT 0,
	`engagementScore` int DEFAULT 0,
	`createdAt` timestamp NOT NULL DEFAULT (now()),
	`updatedAt` timestamp NOT NULL DEFAULT (now()) ON UPDATE CURRENT_TIMESTAMP,
	CONSTRAINT `executive_dashboard_metrics_id` PRIMARY KEY(`id`)
);
--> statement-breakpoint
CREATE TABLE `executive_reports` (
	`id` int AUTO_INCREMENT NOT NULL,
	`reportType` enum('monthly_summary','churn_analysis','intervention_roi','segment_performance','pricing_effectiveness','engagement_trends','risk_dashboard') NOT NULL,
	`reportPeriod` varchar(50) NOT NULL,
	`departmentId` int,
	`generatedAt` timestamp NOT NULL DEFAULT (now()),
	`reportData` text,
	`summary` text,
	`keyMetrics` text,
	`recommendations` text,
	`filePath` varchar(500),
	`generatedBy` int,
	`createdAt` timestamp NOT NULL DEFAULT (now()),
	CONSTRAINT `executive_reports_id` PRIMARY KEY(`id`)
);
--> statement-breakpoint
CREATE TABLE `intervention_actions` (
	`id` int AUTO_INCREMENT NOT NULL,
	`workflowId` int NOT NULL,
	`userId` int NOT NULL,
	`actionType` varchar(50) NOT NULL,
	`description` text,
	`actionData` text,
	`status` enum('pending','in_progress','completed','failed') NOT NULL DEFAULT 'pending',
	`completedAt` timestamp,
	`result` text,
	`createdAt` timestamp NOT NULL DEFAULT (now()),
	CONSTRAINT `intervention_actions_id` PRIMARY KEY(`id`)
);
--> statement-breakpoint
CREATE TABLE `intervention_success_metrics` (
	`id` int AUTO_INCREMENT NOT NULL,
	`workflowId` int NOT NULL,
	`userId` int NOT NULL,
	`interventionType` varchar(50) NOT NULL,
	`preInterventionFwi` int,
	`postInterventionFwi` int,
	`fwiImprovement` int,
	`churnRiskBefore` decimal(5,4),
	`churnRiskAfter` decimal(5,4),
	`churnRiskReduction` decimal(5,4),
	`engagementIncrease` int,
	`estimatedSavings` int,
	`actualSavings` int,
	`successScore` int,
	`notes` text,
	`createdAt` timestamp NOT NULL DEFAULT (now()),
	CONSTRAINT `intervention_success_metrics_id` PRIMARY KEY(`id`)
);
--> statement-breakpoint
CREATE TABLE `intervention_workflows` (
	`id` int AUTO_INCREMENT NOT NULL,
	`userId` int NOT NULL,
	`churnProbability` decimal(5,4) NOT NULL,
	`riskLevel` enum('critical','high','medium','low','minimal') NOT NULL,
	`segment` varchar(50) NOT NULL,
	`interventionType` enum('counseling','education','personalized_offer','manager_alert','ewa_support','goal_creation','engagement_boost') NOT NULL,
	`status` enum('pending','active','paused','completed','failed') NOT NULL DEFAULT 'pending',
	`priority` enum('low','medium','high','critical') NOT NULL,
	`successMetrics` text,
	`actualResults` text,
	`roiEstimated` int,
	`roiActual` int,
	`startedAt` timestamp,
	`completedAt` timestamp,
	`createdAt` timestamp NOT NULL DEFAULT (now()),
	`updatedAt` timestamp NOT NULL DEFAULT (now()) ON UPDATE CURRENT_TIMESTAMP,
	CONSTRAINT `intervention_workflows_id` PRIMARY KEY(`id`)
);
--> statement-breakpoint
CREATE TABLE `mobile_push_notifications` (
	`id` int AUTO_INCREMENT NOT NULL,
	`userId` int NOT NULL,
	`deviceToken` varchar(500) NOT NULL,
	`deviceType` enum('ios','android','web') NOT NULL,
	`appVersion` varchar(20),
	`osVersion` varchar(20),
	`isActive` boolean NOT NULL DEFAULT true,
	`lastUsedAt` timestamp,
	`createdAt` timestamp NOT NULL DEFAULT (now()),
	`updatedAt` timestamp NOT NULL DEFAULT (now()) ON UPDATE CURRENT_TIMESTAMP,
	CONSTRAINT `mobile_push_notifications_id` PRIMARY KEY(`id`)
);
--> statement-breakpoint
CREATE TABLE `push_notification_campaigns` (
	`id` int AUTO_INCREMENT NOT NULL,
	`campaignName` varchar(255) NOT NULL,
	`campaignType` enum('churn_alert','intervention_offer','engagement_boost','achievement','goal_reminder','ewa_available','educational','promotional') NOT NULL,
	`title` varchar(255) NOT NULL,
	`body` text NOT NULL,
	`imageUrl` varchar(500),
	`actionUrl` varchar(500),
	`targetSegment` varchar(100),
	`targetRiskLevel` varchar(50),
	`scheduledAt` timestamp,
	`sentAt` timestamp,
	`status` enum('draft','scheduled','sent','cancelled') NOT NULL DEFAULT 'draft',
	`totalSent` int DEFAULT 0,
	`totalOpened` int DEFAULT 0,
	`totalClicked` int DEFAULT 0,
	`openRate` decimal(5,2) DEFAULT 0,
	`clickRate` decimal(5,2) DEFAULT 0,
	`createdBy` int,
	`createdAt` timestamp NOT NULL DEFAULT (now()),
	`updatedAt` timestamp NOT NULL DEFAULT (now()) ON UPDATE CURRENT_TIMESTAMP,
	CONSTRAINT `push_notification_campaigns_id` PRIMARY KEY(`id`)
);
--> statement-breakpoint
CREATE TABLE `push_notification_delivery_log` (
	`id` int AUTO_INCREMENT NOT NULL,
	`campaignId` int NOT NULL,
	`userId` int NOT NULL,
	`deviceToken` varchar(500) NOT NULL,
	`status` enum('pending','sent','delivered','failed','bounced') NOT NULL DEFAULT 'pending',
	`deliveredAt` timestamp,
	`openedAt` timestamp,
	`clickedAt` timestamp,
	`errorMessage` text,
	`createdAt` timestamp NOT NULL DEFAULT (now()),
	CONSTRAINT `push_notification_delivery_log_id` PRIMARY KEY(`id`)
);
--> statement-breakpoint
CREATE TABLE `report_subscriptions` (
	`id` int AUTO_INCREMENT NOT NULL,
	`userId` int NOT NULL,
	`reportType` varchar(50) NOT NULL,
	`frequency` enum('daily','weekly','monthly','quarterly') NOT NULL,
	`deliveryMethod` enum('email','dashboard','both') NOT NULL DEFAULT 'email',
	`isActive` boolean NOT NULL DEFAULT true,
	`lastSentAt` timestamp,
	`nextSendAt` timestamp,
	`createdAt` timestamp NOT NULL DEFAULT (now()),
	`updatedAt` timestamp NOT NULL DEFAULT (now()) ON UPDATE CURRENT_TIMESTAMP,
	CONSTRAINT `report_subscriptions_id` PRIMARY KEY(`id`)
);
