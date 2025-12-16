CREATE TABLE `alert_suggested_actions` (
	`id` int AUTO_INCREMENT NOT NULL,
	`alertType` varchar(50) NOT NULL,
	`actionType` varchar(50) NOT NULL,
	`actionTitle` varchar(150) NOT NULL,
	`actionDescription` text,
	`actionUrl` varchar(500),
	`educationContentId` int,
	`priority` int NOT NULL DEFAULT 1,
	`estimatedImpact` varchar(100),
	`isActive` boolean NOT NULL DEFAULT true,
	`createdAt` timestamp NOT NULL DEFAULT (now()),
	CONSTRAINT `alert_suggested_actions_id` PRIMARY KEY(`id`)
);
--> statement-breakpoint
CREATE TABLE `ecosystem_engagement_metrics` (
	`id` int AUTO_INCREMENT NOT NULL,
	`departmentId` int NOT NULL,
	`month` int NOT NULL,
	`year` int NOT NULL,
	`totalEmployees` int NOT NULL,
	`activeEmployees` int NOT NULL,
	`avgTreePointsPerEmployee` int NOT NULL,
	`totalTreePointsRedeemed` int NOT NULL,
	`ewaRequestsCount` int NOT NULL,
	`ewaApprovalRate` decimal(5,2) NOT NULL,
	`avgFwiScoreImprovement` int NOT NULL,
	`engagementScore` int NOT NULL,
	`interventionPlansStarted` int NOT NULL,
	`interventionPlansCompleted` int NOT NULL,
	`estimatedROI` int NOT NULL,
	`createdAt` timestamp NOT NULL DEFAULT (now()),
	CONSTRAINT `ecosystem_engagement_metrics_id` PRIMARY KEY(`id`)
);
--> statement-breakpoint
CREATE TABLE `ewa_dynamic_rates` (
	`id` int AUTO_INCREMENT NOT NULL,
	`minFwiScore` int NOT NULL,
	`maxFwiScore` int NOT NULL,
	`baseFeePercentage` decimal(5,2) NOT NULL,
	`feeDescription` varchar(200),
	`riskLevel` enum('low','medium','high','critical') NOT NULL,
	`incentiveMessage` text,
	`isActive` boolean NOT NULL DEFAULT true,
	`createdAt` timestamp NOT NULL DEFAULT (now()),
	`updatedAt` timestamp NOT NULL DEFAULT (now()) ON UPDATE CURRENT_TIMESTAMP,
	CONSTRAINT `ewa_dynamic_rates_id` PRIMARY KEY(`id`)
);
--> statement-breakpoint
CREATE TABLE `personalized_recommendations` (
	`id` int AUTO_INCREMENT NOT NULL,
	`userId` int NOT NULL,
	`offerId` int NOT NULL,
	`recommendationType` varchar(50) NOT NULL,
	`relevanceScore` int NOT NULL,
	`urgency` enum('low','medium','high') NOT NULL DEFAULT 'medium',
	`estimatedSavings` int,
	`socialProof` text,
	`isViewed` boolean NOT NULL DEFAULT false,
	`isConverted` boolean NOT NULL DEFAULT false,
	`convertedAt` timestamp,
	`expiresAt` timestamp,
	`createdAt` timestamp NOT NULL DEFAULT (now()),
	CONSTRAINT `personalized_recommendations_id` PRIMARY KEY(`id`)
);
--> statement-breakpoint
CREATE TABLE `reward_tiers` (
	`id` int AUTO_INCREMENT NOT NULL,
	`minPoints` int NOT NULL,
	`maxPoints` int,
	`discountPercentage` int NOT NULL,
	`ewaRateReduction` int NOT NULL DEFAULT 0,
	`tierName` varchar(50) NOT NULL,
	`tierColor` varchar(20) NOT NULL,
	`tierIcon` varchar(50) NOT NULL,
	`description` text,
	`isActive` boolean NOT NULL DEFAULT true,
	`createdAt` timestamp NOT NULL DEFAULT (now()),
	`updatedAt` timestamp NOT NULL DEFAULT (now()) ON UPDATE CURRENT_TIMESTAMP,
	CONSTRAINT `reward_tiers_id` PRIMARY KEY(`id`)
);
--> statement-breakpoint
CREATE TABLE `risk_intervention_plans` (
	`id` int AUTO_INCREMENT NOT NULL,
	`userId` int NOT NULL,
	`riskCluster` varchar(100) NOT NULL,
	`severity` enum('low','medium','high','critical') NOT NULL,
	`interventionType` enum('education','personalized_goal','merchant_offers','ewa_counseling','manager_alert') NOT NULL,
	`interventionStatus` enum('pending','active','paused','completed','failed') NOT NULL DEFAULT 'pending',
	`expectedOutcome` text,
	`actualOutcome` text,
	`roiEstimated` int,
	`roiActual` int,
	`startedAt` timestamp,
	`completedAt` timestamp,
	`createdAt` timestamp NOT NULL DEFAULT (now()),
	`updatedAt` timestamp NOT NULL DEFAULT (now()) ON UPDATE CURRENT_TIMESTAMP,
	CONSTRAINT `risk_intervention_plans_id` PRIMARY KEY(`id`)
);
--> statement-breakpoint
CREATE TABLE `spending_insights` (
	`id` int AUTO_INCREMENT NOT NULL,
	`userId` int NOT NULL,
	`month` int NOT NULL,
	`year` int NOT NULL,
	`totalSpending` int NOT NULL,
	`budgetRecommended` int NOT NULL,
	`savingsOpportunity` int NOT NULL,
	`topCategory` varchar(50),
	`topCategoryAmount` int,
	`anomalies` text,
	`predictions` text,
	`recommendedActions` text,
	`createdAt` timestamp NOT NULL DEFAULT (now()),
	`updatedAt` timestamp NOT NULL DEFAULT (now()) ON UPDATE CURRENT_TIMESTAMP,
	CONSTRAINT `spending_insights_id` PRIMARY KEY(`id`)
);
