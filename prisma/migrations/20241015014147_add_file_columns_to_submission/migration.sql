-- AlterTable
ALTER TABLE `submission` ADD COLUMN `fileName` VARCHAR(191) NULL,
    ADD COLUMN `fileType` VARCHAR(191) NULL,
    ADD COLUMN `fileUrl` VARCHAR(191) NULL;
