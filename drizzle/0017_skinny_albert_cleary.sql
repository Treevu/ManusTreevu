ALTER TABLE `executive_dashboard_metrics` MODIFY COLUMN `interventionSuccessRate` decimal(5,2) DEFAULT '0';--> statement-breakpoint
ALTER TABLE `executive_dashboard_metrics` MODIFY COLUMN `ewaApprovalRate` decimal(5,2) DEFAULT '0';--> statement-breakpoint
ALTER TABLE `push_notification_campaigns` MODIFY COLUMN `openRate` decimal(5,2) DEFAULT '0';--> statement-breakpoint
ALTER TABLE `push_notification_campaigns` MODIFY COLUMN `clickRate` decimal(5,2) DEFAULT '0';