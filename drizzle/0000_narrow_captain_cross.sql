CREATE TABLE `achievements` (
	`id` int AUTO_INCREMENT NOT NULL,
	`code` varchar(50) NOT NULL,
	`name` varchar(100) NOT NULL,
	`description` text NOT NULL,
	`icon` varchar(50) NOT NULL,
	`category` enum('financial','savings','engagement','social','milestone') NOT NULL,
	`rarity` enum('common','rare','epic','legendary') NOT NULL DEFAULT 'common',
	`pointsReward` int NOT NULL DEFAULT 0,
	`requirement` text,
	`isHidden` boolean NOT NULL DEFAULT false,
	`sortOrder` int NOT NULL DEFAULT 0,
	`createdAt` timestamp NOT NULL DEFAULT (now()),
	CONSTRAINT `achievements_id` PRIMARY KEY(`id`),
	CONSTRAINT `achievements_code_unique` UNIQUE(`code`)
);
--> statement-breakpoint
CREATE TABLE `active_challenges` (
	`id` int AUTO_INCREMENT NOT NULL,
	`challengeId` int NOT NULL,
	`weekNumber` int NOT NULL,
	`year` int NOT NULL,
	`startsAt` timestamp NOT NULL,
	`endsAt` timestamp NOT NULL,
	`participantCount` int NOT NULL DEFAULT 0,
	`completionCount` int NOT NULL DEFAULT 0,
	`createdAt` timestamp NOT NULL DEFAULT (now()),
	CONSTRAINT `active_challenges_id` PRIMARY KEY(`id`)
);
--> statement-breakpoint
CREATE TABLE `alert_history` (
	`id` int AUTO_INCREMENT NOT NULL,
	`ruleId` int NOT NULL,
	`alertType` enum('fwi_department_low','fwi_individual_low','fwi_trend_negative','ewa_pending_count','ewa_pending_amount','ewa_user_excessive','high_risk_percentage','new_high_risk_user','weekly_risk_summary') NOT NULL,
	`departmentId` int,
	`userId` int,
	`previousValue` int,
	`currentValue` int NOT NULL,
	`threshold` int NOT NULL,
	`message` text NOT NULL,
	`severity` enum('info','warning','critical') NOT NULL DEFAULT 'warning',
	`notifiedViaEmail` boolean NOT NULL DEFAULT false,
	`notifiedViaPush` boolean NOT NULL DEFAULT false,
	`notifiedViaInApp` boolean NOT NULL DEFAULT false,
	`notifiedUsers` text,
	`acknowledgedBy` int,
	`acknowledgedAt` timestamp,
	`resolvedAt` timestamp,
	`createdAt` timestamp NOT NULL DEFAULT (now()),
	CONSTRAINT `alert_history_id` PRIMARY KEY(`id`)
);
--> statement-breakpoint
CREATE TABLE `alert_rules` (
	`id` int AUTO_INCREMENT NOT NULL,
	`name` varchar(255) NOT NULL,
	`description` text,
	`alertType` enum('fwi_department_low','fwi_individual_low','fwi_trend_negative','ewa_pending_count','ewa_pending_amount','ewa_user_excessive','high_risk_percentage','new_high_risk_user','weekly_risk_summary') NOT NULL,
	`threshold` int NOT NULL,
	`comparisonOperator` enum('lt','lte','gt','gte','eq') NOT NULL DEFAULT 'lt',
	`departmentId` int,
	`isEnabled` boolean NOT NULL DEFAULT true,
	`notifyEmail` boolean NOT NULL DEFAULT true,
	`notifyPush` boolean NOT NULL DEFAULT true,
	`notifyInApp` boolean NOT NULL DEFAULT true,
	`notifyAdmins` boolean NOT NULL DEFAULT true,
	`notifyB2BAdmin` boolean NOT NULL DEFAULT true,
	`cooldownMinutes` int NOT NULL DEFAULT 60,
	`createdBy` int NOT NULL,
	`createdAt` timestamp NOT NULL DEFAULT (now()),
	`updatedAt` timestamp NOT NULL DEFAULT (now()) ON UPDATE CURRENT_TIMESTAMP,
	CONSTRAINT `alert_rules_id` PRIMARY KEY(`id`)
);
--> statement-breakpoint
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
CREATE TABLE `badges` (
	`id` int AUTO_INCREMENT NOT NULL,
	`code` varchar(50) NOT NULL,
	`name` varchar(100) NOT NULL,
	`description` text NOT NULL,
	`icon` varchar(50) NOT NULL,
	`color` varchar(20) NOT NULL,
	`category` enum('education','financial','engagement','social','merchant','b2b') NOT NULL,
	`requirement` text NOT NULL,
	`pointsReward` int NOT NULL DEFAULT 0,
	`rarity` enum('common','rare','epic','legendary') NOT NULL DEFAULT 'common',
	`isActive` boolean NOT NULL DEFAULT true,
	`createdAt` timestamp NOT NULL DEFAULT (now()),
	CONSTRAINT `badges_id` PRIMARY KEY(`id`),
	CONSTRAINT `badges_code_unique` UNIQUE(`code`)
);
--> statement-breakpoint
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
CREATE TABLE `education_progress` (
	`id` int AUTO_INCREMENT NOT NULL,
	`userId` int NOT NULL,
	`tutorialType` varchar(50) NOT NULL,
	`stepsCompleted` int NOT NULL DEFAULT 0,
	`totalSteps` int NOT NULL,
	`isCompleted` boolean NOT NULL DEFAULT false,
	`pointsAwarded` int NOT NULL DEFAULT 0,
	`completedAt` timestamp,
	`createdAt` timestamp NOT NULL DEFAULT (now()),
	`updatedAt` timestamp NOT NULL DEFAULT (now()) ON UPDATE CURRENT_TIMESTAMP,
	CONSTRAINT `education_progress_id` PRIMARY KEY(`id`)
);
--> statement-breakpoint
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
CREATE TABLE `leads` (
	`id` int AUTO_INCREMENT NOT NULL,
	`companyName` varchar(255) NOT NULL,
	`contactName` varchar(255) NOT NULL,
	`email` varchar(320) NOT NULL,
	`phone` varchar(50),
	`employeeCount` varchar(50),
	`industry` varchar(100),
	`source` varchar(100) DEFAULT 'founders_form',
	`message` text,
	`status` enum('new','contacted','qualified','converted','lost') NOT NULL DEFAULT 'new',
	`createdAt` timestamp NOT NULL DEFAULT (now()),
	`updatedAt` timestamp NOT NULL DEFAULT (now()) ON UPDATE CURRENT_TIMESTAMP,
	CONSTRAINT `leads_id` PRIMARY KEY(`id`)
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
CREATE TABLE `monthly_metrics_snapshots` (
	`id` int AUTO_INCREMENT NOT NULL,
	`organizationId` int,
	`departmentId` int,
	`year` int NOT NULL,
	`month` int NOT NULL,
	`avgFwiScore` int NOT NULL,
	`totalEmployees` int NOT NULL,
	`employeesAtRisk` int NOT NULL DEFAULT 0,
	`riskPercentage` int NOT NULL DEFAULT 0,
	`totalEwaRequests` int NOT NULL DEFAULT 0,
	`totalEwaAmount` int NOT NULL DEFAULT 0,
	`avgEngagementScore` int DEFAULT 0,
	`totalTreePointsEarned` int NOT NULL DEFAULT 0,
	`totalTreePointsRedeemed` int NOT NULL DEFAULT 0,
	`goalsCreated` int NOT NULL DEFAULT 0,
	`goalsCompleted` int NOT NULL DEFAULT 0,
	`alertsTriggered` int NOT NULL DEFAULT 0,
	`createdAt` timestamp NOT NULL DEFAULT (now()),
	CONSTRAINT `monthly_metrics_snapshots_id` PRIMARY KEY(`id`)
);
--> statement-breakpoint
CREATE TABLE `notification_preferences` (
	`id` int AUTO_INCREMENT NOT NULL,
	`userId` int NOT NULL,
	`ewaApproved` boolean NOT NULL DEFAULT true,
	`ewaRejected` boolean NOT NULL DEFAULT true,
	`ewaDisbursed` boolean NOT NULL DEFAULT true,
	`treepointsReceived` boolean NOT NULL DEFAULT true,
	`treepointsRedeemed` boolean NOT NULL DEFAULT true,
	`goalProgress` boolean NOT NULL DEFAULT true,
	`goalCompleted` boolean NOT NULL DEFAULT true,
	`fwiImproved` boolean NOT NULL DEFAULT true,
	`fwiAlert` boolean NOT NULL DEFAULT true,
	`levelUp` boolean NOT NULL DEFAULT true,
	`streakMilestone` boolean NOT NULL DEFAULT true,
	`offerAvailable` boolean NOT NULL DEFAULT true,
	`systemAnnouncement` boolean NOT NULL DEFAULT true,
	`securityAlert` boolean NOT NULL DEFAULT true,
	`inAppEnabled` boolean NOT NULL DEFAULT true,
	`emailEnabled` boolean NOT NULL DEFAULT false,
	`pushEnabled` boolean NOT NULL DEFAULT false,
	`createdAt` timestamp NOT NULL DEFAULT (now()),
	`updatedAt` timestamp NOT NULL DEFAULT (now()) ON UPDATE CURRENT_TIMESTAMP,
	CONSTRAINT `notification_preferences_id` PRIMARY KEY(`id`),
	CONSTRAINT `notification_preferences_userId_unique` UNIQUE(`userId`)
);
--> statement-breakpoint
CREATE TABLE `notifications` (
	`id` int AUTO_INCREMENT NOT NULL,
	`userId` int NOT NULL,
	`type` enum('ewa_approved','ewa_rejected','ewa_disbursed','treepoints_received','treepoints_redeemed','goal_progress','goal_completed','fwi_improved','fwi_alert','level_up','streak_milestone','offer_available','system_announcement','security_alert','referral_bonus') NOT NULL,
	`title` varchar(200) NOT NULL,
	`message` text NOT NULL,
	`icon` varchar(50),
	`actionUrl` varchar(500),
	`actionLabel` varchar(100),
	`metadata` text,
	`isRead` boolean NOT NULL DEFAULT false,
	`readAt` timestamp,
	`createdAt` timestamp NOT NULL DEFAULT (now()),
	CONSTRAINT `notifications_id` PRIMARY KEY(`id`)
);
--> statement-breakpoint
CREATE TABLE `offer_redemptions` (
	`id` int AUTO_INCREMENT NOT NULL,
	`offerId` int NOT NULL,
	`userId` int NOT NULL,
	`merchantId` int NOT NULL,
	`pointsSpent` int NOT NULL,
	`couponCode` varchar(50) NOT NULL,
	`qrCodeData` text,
	`status` enum('pending','validated','expired','cancelled') NOT NULL DEFAULT 'pending',
	`validatedAt` timestamp,
	`validatedBy` int,
	`expiresAt` timestamp,
	`createdAt` timestamp NOT NULL DEFAULT (now()),
	CONSTRAINT `offer_redemptions_id` PRIMARY KEY(`id`),
	CONSTRAINT `offer_redemptions_couponCode_unique` UNIQUE(`couponCode`)
);
--> statement-breakpoint
CREATE TABLE `organization_alert_thresholds` (
	`id` int AUTO_INCREMENT NOT NULL,
	`organizationId` int NOT NULL,
	`fwiCriticalThreshold` int NOT NULL DEFAULT 30,
	`fwiWarningThreshold` int NOT NULL DEFAULT 50,
	`fwiHealthyThreshold` int NOT NULL DEFAULT 70,
	`riskCriticalPercentage` int NOT NULL DEFAULT 25,
	`riskWarningPercentage` int NOT NULL DEFAULT 15,
	`ewaMaxPendingCount` int NOT NULL DEFAULT 10,
	`ewaMaxPendingAmount` int NOT NULL DEFAULT 50000,
	`ewaMaxPerEmployee` int NOT NULL DEFAULT 3,
	`notifyOnCritical` boolean NOT NULL DEFAULT true,
	`notifyOnWarning` boolean NOT NULL DEFAULT true,
	`notifyOnInfo` boolean NOT NULL DEFAULT false,
	`notifyEmails` text,
	`notifySlackWebhook` varchar(500),
	`createdBy` int NOT NULL,
	`createdAt` timestamp NOT NULL DEFAULT (now()),
	`updatedAt` timestamp NOT NULL DEFAULT (now()) ON UPDATE CURRENT_TIMESTAMP,
	CONSTRAINT `organization_alert_thresholds_id` PRIMARY KEY(`id`)
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
--> statement-breakpoint
CREATE TABLE `referrals` (
	`id` int AUTO_INCREMENT NOT NULL,
	`referrerId` int NOT NULL,
	`referredId` int,
	`referralCode` varchar(20) NOT NULL,
	`referredEmail` varchar(320),
	`status` enum('pending','registered','rewarded','expired') NOT NULL DEFAULT 'pending',
	`rewardAmount` int NOT NULL DEFAULT 500,
	`referrerRewarded` boolean NOT NULL DEFAULT false,
	`referredRewarded` boolean NOT NULL DEFAULT false,
	`expiresAt` timestamp,
	`registeredAt` timestamp,
	`createdAt` timestamp NOT NULL DEFAULT (now()),
	CONSTRAINT `referrals_id` PRIMARY KEY(`id`),
	CONSTRAINT `referrals_referralCode_unique` UNIQUE(`referralCode`)
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
CREATE TABLE `streak_history` (
	`id` int AUTO_INCREMENT NOT NULL,
	`userId` int NOT NULL,
	`activityDate` timestamp NOT NULL,
	`activityType` enum('login','transaction','tutorial','challenge','goal_update') NOT NULL,
	`createdAt` timestamp NOT NULL DEFAULT (now()),
	CONSTRAINT `streak_history_id` PRIMARY KEY(`id`)
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
CREATE TABLE `user_achievements` (
	`id` int AUTO_INCREMENT NOT NULL,
	`userId` int NOT NULL,
	`achievementId` int NOT NULL,
	`unlockedAt` timestamp NOT NULL DEFAULT (now()),
	`progress` int NOT NULL DEFAULT 100,
	`notified` boolean NOT NULL DEFAULT false,
	CONSTRAINT `user_achievements_id` PRIMARY KEY(`id`)
);
--> statement-breakpoint
CREATE TABLE `user_badges` (
	`id` int AUTO_INCREMENT NOT NULL,
	`userId` int NOT NULL,
	`badgeId` int NOT NULL,
	`earnedAt` timestamp NOT NULL DEFAULT (now()),
	`notified` boolean NOT NULL DEFAULT false,
	`displayOrder` int NOT NULL DEFAULT 0,
	CONSTRAINT `user_badges_id` PRIMARY KEY(`id`)
);
--> statement-breakpoint
CREATE TABLE `user_challenge_progress` (
	`id` int AUTO_INCREMENT NOT NULL,
	`userId` int NOT NULL,
	`activeChallengeId` int NOT NULL,
	`currentProgress` int NOT NULL DEFAULT 0,
	`isCompleted` boolean NOT NULL DEFAULT false,
	`completedAt` timestamp,
	`pointsAwarded` int NOT NULL DEFAULT 0,
	`joinedAt` timestamp NOT NULL DEFAULT (now()),
	`updatedAt` timestamp NOT NULL DEFAULT (now()) ON UPDATE CURRENT_TIMESTAMP,
	CONSTRAINT `user_challenge_progress_id` PRIMARY KEY(`id`)
);
--> statement-breakpoint
CREATE TABLE `user_profile_settings` (
	`id` int AUTO_INCREMENT NOT NULL,
	`userId` int NOT NULL,
	`isPublic` boolean NOT NULL DEFAULT true,
	`showBadges` boolean NOT NULL DEFAULT true,
	`showLevel` boolean NOT NULL DEFAULT true,
	`showFwiScore` boolean NOT NULL DEFAULT false,
	`showStreak` boolean NOT NULL DEFAULT true,
	`showLeaderboardRank` boolean NOT NULL DEFAULT true,
	`bio` varchar(300),
	`avatarUrl` text,
	`featuredBadges` text,
	`createdAt` timestamp NOT NULL DEFAULT (now()),
	`updatedAt` timestamp NOT NULL DEFAULT (now()) ON UPDATE CURRENT_TIMESTAMP,
	CONSTRAINT `user_profile_settings_id` PRIMARY KEY(`id`),
	CONSTRAINT `user_profile_settings_userId_unique` UNIQUE(`userId`)
);
--> statement-breakpoint
CREATE TABLE `users` (
	`id` int AUTO_INCREMENT NOT NULL,
	`openId` varchar(64) NOT NULL,
	`name` text,
	`email` varchar(320),
	`loginMethod` varchar(64),
	`role` enum('admin','employee','merchant','b2b_admin') NOT NULL DEFAULT 'employee',
	`departmentId` int,
	`monthlyIncome` int DEFAULT 0,
	`fwiScore` int DEFAULT 50,
	`treePoints` int DEFAULT 0,
	`streakDays` int DEFAULT 0,
	`level` int DEFAULT 1,
	`workModality` enum('remote','hybrid','onsite') DEFAULT 'onsite',
	`merchantLevel` enum('bronze','silver','gold'),
	`merchantRole` enum('admin','editor','viewer'),
	`status` enum('active','pending','suspended') NOT NULL DEFAULT 'active',
	`createdAt` timestamp NOT NULL DEFAULT (now()),
	`updatedAt` timestamp NOT NULL DEFAULT (now()) ON UPDATE CURRENT_TIMESTAMP,
	`lastSignedIn` timestamp NOT NULL DEFAULT (now()),
	CONSTRAINT `users_id` PRIMARY KEY(`id`),
	CONSTRAINT `users_openId_unique` UNIQUE(`openId`)
);
--> statement-breakpoint
CREATE TABLE `weekly_challenges` (
	`id` int AUTO_INCREMENT NOT NULL,
	`code` varchar(50) NOT NULL,
	`title` varchar(150) NOT NULL,
	`description` text NOT NULL,
	`icon` varchar(50) NOT NULL,
	`color` varchar(20) NOT NULL,
	`category` enum('spending','savings','education','engagement','social','fwi') NOT NULL,
	`targetValue` int NOT NULL,
	`targetUnit` varchar(30) NOT NULL,
	`pointsReward` int NOT NULL,
	`badgeReward` varchar(50),
	`difficulty` enum('easy','medium','hard') NOT NULL DEFAULT 'medium',
	`isActive` boolean NOT NULL DEFAULT true,
	`createdAt` timestamp NOT NULL DEFAULT (now()),
	CONSTRAINT `weekly_challenges_id` PRIMARY KEY(`id`),
	CONSTRAINT `weekly_challenges_code_unique` UNIQUE(`code`)
);
