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
CREATE TABLE `streak_history` (
	`id` int AUTO_INCREMENT NOT NULL,
	`userId` int NOT NULL,
	`activityDate` timestamp NOT NULL,
	`activityType` enum('login','transaction','tutorial','challenge','goal_update') NOT NULL,
	`createdAt` timestamp NOT NULL DEFAULT (now()),
	CONSTRAINT `streak_history_id` PRIMARY KEY(`id`)
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
