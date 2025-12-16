CREATE TABLE `oauth_accounts` (
	`id` int AUTO_INCREMENT NOT NULL,
	`userId` int NOT NULL,
	`provider` enum('google','github','microsoft','manus') NOT NULL,
	`providerAccountId` varchar(255) NOT NULL,
	`email` varchar(320),
	`name` varchar(255),
	`picture` text,
	`accessToken` text,
	`refreshToken` text,
	`expiresAt` timestamp,
	`scope` text,
	`tokenType` varchar(50),
	`idToken` text,
	`sessionState` varchar(255),
	`isLinked` boolean NOT NULL DEFAULT true,
	`isPrimary` boolean NOT NULL DEFAULT false,
	`lastUsedAt` timestamp,
	`createdAt` timestamp NOT NULL DEFAULT (now()),
	`updatedAt` timestamp NOT NULL DEFAULT (now()) ON UPDATE CURRENT_TIMESTAMP,
	CONSTRAINT `oauth_accounts_id` PRIMARY KEY(`id`)
);
--> statement-breakpoint
CREATE TABLE `oauth_sessions` (
	`id` int AUTO_INCREMENT NOT NULL,
	`userId` int NOT NULL,
	`provider` enum('google','github','microsoft','manus') NOT NULL,
	`sessionToken` varchar(255) NOT NULL,
	`expiresAt` timestamp NOT NULL,
	`userAgent` text,
	`ipAddress` varchar(45),
	`isActive` boolean NOT NULL DEFAULT true,
	`createdAt` timestamp NOT NULL DEFAULT (now()),
	`updatedAt` timestamp NOT NULL DEFAULT (now()) ON UPDATE CURRENT_TIMESTAMP,
	CONSTRAINT `oauth_sessions_id` PRIMARY KEY(`id`),
	CONSTRAINT `oauth_sessions_sessionToken_unique` UNIQUE(`sessionToken`)
);
