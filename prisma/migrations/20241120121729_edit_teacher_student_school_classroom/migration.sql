-- AlterTable
ALTER TABLE `classroom` MODIFY `updatedAt` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3);

-- AlterTable
ALTER TABLE `student` MODIFY `loginCode` VARCHAR(191) NULL;

-- AlterTable
ALTER TABLE `teacher` MODIFY `email` VARCHAR(191) NULL;
