CREATE TABLE `waste_listings` (
	`id` int AUTO_INCREMENT NOT NULL,
	`ownerId` int NOT NULL,
	`classId` varchar(96) NOT NULL,
	`displayNameEn` varchar(160) NOT NULL,
	`displayNameAr` varchar(160) NOT NULL,
	`weightKg` decimal(10,3) NOT NULL,
	`location` varchar(160) NOT NULL,
	`condition` varchar(120),
	`notes` text,
	`imageUrl` text,
	`status` enum('active','removed') NOT NULL DEFAULT 'active',
	`createdAt` timestamp NOT NULL DEFAULT (now()),
	`updatedAt` timestamp NOT NULL DEFAULT (now()) ON UPDATE CURRENT_TIMESTAMP,
	CONSTRAINT `waste_listings_id` PRIMARY KEY(`id`)
);
--> statement-breakpoint
CREATE TABLE `waste_reference_data` (
	`id` int AUTO_INCREMENT NOT NULL,
	`classId` varchar(96) NOT NULL,
	`displayNameEn` varchar(160) NOT NULL,
	`displayNameAr` varchar(160) NOT NULL,
	`category` varchar(96) NOT NULL,
	`priceEgpPerKg` decimal(10,3),
	`lhvMjPerKg` decimal(10,3),
	`combustible` boolean NOT NULL DEFAULT false,
	`status` enum('reference','pending') NOT NULL DEFAULT 'pending',
	`sourceNote` text NOT NULL,
	`createdAt` timestamp NOT NULL DEFAULT (now()),
	`updatedAt` timestamp NOT NULL DEFAULT (now()) ON UPDATE CURRENT_TIMESTAMP,
	CONSTRAINT `waste_reference_data_id` PRIMARY KEY(`id`),
	CONSTRAINT `waste_reference_data_classId_unique` UNIQUE(`classId`)
);
