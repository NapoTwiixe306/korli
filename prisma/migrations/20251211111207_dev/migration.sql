-- AlterTable
ALTER TABLE `BlockClick` ADD COLUMN `country` VARCHAR(191) NULL,
    ADD COLUMN `device` VARCHAR(191) NULL,
    ADD COLUMN `ruleIds` JSON NULL,
    ADD COLUMN `source` VARCHAR(191) NULL,
    ADD COLUMN `userPageId` VARCHAR(191) NULL,
    ADD COLUMN `visitorId` VARCHAR(191) NULL;

-- AlterTable
ALTER TABLE `PageView` ADD COLUMN `country` VARCHAR(191) NULL,
    ADD COLUMN `device` VARCHAR(191) NULL,
    ADD COLUMN `isReturning` BOOLEAN NOT NULL DEFAULT false,
    ADD COLUMN `ruleIds` JSON NULL,
    ADD COLUMN `source` VARCHAR(191) NULL,
    ADD COLUMN `visitorId` VARCHAR(191) NULL;

-- AlterTable
ALTER TABLE `UserPage` ADD COLUMN `customTrafficSources` JSON NULL;

-- CreateIndex
CREATE INDEX `BlockClick_userPageId_idx` ON `BlockClick`(`userPageId`);
