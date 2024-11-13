/*
  Warnings:

  - You are about to drop the column `parentCategoryId` on the `category` table. All the data in the column will be lost.

*/
-- DropForeignKey
ALTER TABLE `category` DROP FOREIGN KEY `Category_parentCategoryId_fkey`;

-- AlterTable
ALTER TABLE `category` DROP COLUMN `parentCategoryId`;
