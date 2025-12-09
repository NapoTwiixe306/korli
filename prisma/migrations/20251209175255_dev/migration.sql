-- AlterTable
ALTER TABLE `UserPage` ADD COLUMN `animations` VARCHAR(191) NOT NULL DEFAULT 'all',
    ADD COLUMN `layout` VARCHAR(191) NOT NULL DEFAULT 'list',
    ADD COLUMN `socialHeaderBlockIds` JSON NULL,
    ADD COLUMN `socialHeaderEnabled` BOOLEAN NOT NULL DEFAULT false,
    ADD COLUMN `subtitle` TEXT NULL,
    ADD COLUMN `themeConfig` JSON NULL;

-- CreateTable
CREATE TABLE `PageView` (
    `id` VARCHAR(191) NOT NULL,
    `userPageId` VARCHAR(191) NOT NULL,
    `ipAddress` VARCHAR(191) NULL,
    `userAgent` VARCHAR(191) NULL,
    `referer` VARCHAR(191) NULL,
    `createdAt` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),

    INDEX `PageView_userPageId_idx`(`userPageId`),
    INDEX `PageView_userPageId_createdAt_idx`(`userPageId`, `createdAt`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `BlockClick` (
    `id` VARCHAR(191) NOT NULL,
    `blockId` VARCHAR(191) NOT NULL,
    `ipAddress` VARCHAR(191) NULL,
    `userAgent` VARCHAR(191) NULL,
    `referer` VARCHAR(191) NULL,
    `createdAt` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),

    INDEX `BlockClick_blockId_idx`(`blockId`),
    INDEX `BlockClick_blockId_createdAt_idx`(`blockId`, `createdAt`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `Shortlink` (
    `id` VARCHAR(191) NOT NULL,
    `userPageId` VARCHAR(191) NOT NULL,
    `alias` VARCHAR(191) NOT NULL,
    `url` TEXT NOT NULL,
    `clicks` INTEGER NOT NULL DEFAULT 0,
    `createdAt` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `updatedAt` DATETIME(3) NOT NULL,

    UNIQUE INDEX `Shortlink_alias_key`(`alias`),
    INDEX `Shortlink_userPageId_idx`(`userPageId`),
    INDEX `Shortlink_alias_idx`(`alias`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `SmartRule` (
    `id` VARCHAR(191) NOT NULL,
    `userPageId` VARCHAR(191) NOT NULL,
    `name` VARCHAR(191) NOT NULL,
    `isActive` BOOLEAN NOT NULL DEFAULT true,
    `priority` INTEGER NOT NULL DEFAULT 0,
    `conditions` JSON NOT NULL,
    `actions` JSON NOT NULL,
    `createdAt` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `updatedAt` DATETIME(3) NOT NULL,

    INDEX `SmartRule_userPageId_idx`(`userPageId`),
    INDEX `SmartRule_userPageId_priority_idx`(`userPageId`, `priority`),
    INDEX `SmartRule_userPageId_isActive_idx`(`userPageId`, `isActive`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- AddForeignKey
ALTER TABLE `PageView` ADD CONSTRAINT `PageView_userPageId_fkey` FOREIGN KEY (`userPageId`) REFERENCES `UserPage`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `BlockClick` ADD CONSTRAINT `BlockClick_blockId_fkey` FOREIGN KEY (`blockId`) REFERENCES `Block`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `Shortlink` ADD CONSTRAINT `Shortlink_userPageId_fkey` FOREIGN KEY (`userPageId`) REFERENCES `UserPage`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `SmartRule` ADD CONSTRAINT `SmartRule_userPageId_fkey` FOREIGN KEY (`userPageId`) REFERENCES `UserPage`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;
