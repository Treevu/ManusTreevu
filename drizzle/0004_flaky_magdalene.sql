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
CREATE TABLE `user_achievements` (
	`id` int AUTO_INCREMENT NOT NULL,
	`userId` int NOT NULL,
	`achievementId` int NOT NULL,
	`unlockedAt` timestamp NOT NULL DEFAULT (now()),
	`progress` int NOT NULL DEFAULT 100,
	`notified` boolean NOT NULL DEFAULT false,
	CONSTRAINT `user_achievements_id` PRIMARY KEY(`id`)
);
