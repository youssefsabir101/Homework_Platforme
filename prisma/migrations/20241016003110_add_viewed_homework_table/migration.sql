/*
  Warnings:

  - You are about to drop the `_viewedhomeworks` table. If the table is not empty, all the data it contains will be lost.

*/
-- DropForeignKey
ALTER TABLE `_viewedhomeworks` DROP FOREIGN KEY `_ViewedHomeworks_A_fkey`;

-- DropForeignKey
ALTER TABLE `_viewedhomeworks` DROP FOREIGN KEY `_ViewedHomeworks_B_fkey`;

-- DropTable
DROP TABLE `_viewedhomeworks`;

-- CreateTable
CREATE TABLE `viewed_homework` (
    `userId` INTEGER NOT NULL,
    `homeworkId` INTEGER NOT NULL,

    INDEX `viewed_homework_userId_idx`(`userId`),
    INDEX `viewed_homework_homeworkId_idx`(`homeworkId`),
    PRIMARY KEY (`userId`, `homeworkId`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- AddForeignKey
ALTER TABLE `viewed_homework` ADD CONSTRAINT `viewed_homework_userId_fkey` FOREIGN KEY (`userId`) REFERENCES `User`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `viewed_homework` ADD CONSTRAINT `viewed_homework_homeworkId_fkey` FOREIGN KEY (`homeworkId`) REFERENCES `Homework`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;
