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
