-- Add A/B fields on Block
ALTER TABLE `Block`
  ADD COLUMN `abGroup` VARCHAR(191) NULL,
  ADD COLUMN `abWeight` INTEGER NOT NULL DEFAULT 100;

-- Add variant/session on PageView
ALTER TABLE `PageView`
  ADD COLUMN `variant` VARCHAR(191) NULL,
  ADD COLUMN `sessionId` VARCHAR(191) NULL;

-- Add variant on BlockClick
ALTER TABLE `BlockClick`
  ADD COLUMN `variant` VARCHAR(191) NULL;

-- Helpful indexes
CREATE INDEX `idx_pageview_variant` ON `PageView`(`variant`);
CREATE INDEX `idx_blockclick_variant` ON `BlockClick`(`variant`);
