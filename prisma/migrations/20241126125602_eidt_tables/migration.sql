/*
  Warnings:

  - You are about to drop the column `userId` on the `homework` table. All the data in the column will be lost.
  - You are about to drop the column `userId` on the `submission` table. All the data in the column will be lost.
  - You are about to drop the column `schoolId` on the `user` table. All the data in the column will be lost.
  - You are about to drop the `_studentclassrooms` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `_teacherclassrooms` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `_userclassrooms` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `classroom` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `school` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `student` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `teacher` table. If the table is not empty, all the data it contains will be lost.
  - Made the column `teacherId` on table `homework` required. This step will fail if there are existing NULL values in that column.
  - Made the column `studentId` on table `submission` required. This step will fail if there are existing NULL values in that column.

*/
-- DropForeignKey
ALTER TABLE `_studentclassrooms` DROP FOREIGN KEY `_StudentClassrooms_A_fkey`;

-- DropForeignKey
ALTER TABLE `_studentclassrooms` DROP FOREIGN KEY `_StudentClassrooms_B_fkey`;

-- DropForeignKey
ALTER TABLE `_teacherclassrooms` DROP FOREIGN KEY `_TeacherClassrooms_A_fkey`;

-- DropForeignKey
ALTER TABLE `_teacherclassrooms` DROP FOREIGN KEY `_TeacherClassrooms_B_fkey`;

-- DropForeignKey
ALTER TABLE `_userclassrooms` DROP FOREIGN KEY `_UserClassrooms_A_fkey`;

-- DropForeignKey
ALTER TABLE `_userclassrooms` DROP FOREIGN KEY `_UserClassrooms_B_fkey`;

-- DropForeignKey
ALTER TABLE `classroom` DROP FOREIGN KEY `Classroom_schoolId_fkey`;

-- DropForeignKey
ALTER TABLE `homework` DROP FOREIGN KEY `Homework_teacherId_fkey`;

-- DropForeignKey
ALTER TABLE `homework` DROP FOREIGN KEY `Homework_userId_fkey`;

-- DropForeignKey
ALTER TABLE `student` DROP FOREIGN KEY `Student_schoolId_fkey`;

-- DropForeignKey
ALTER TABLE `submission` DROP FOREIGN KEY `Submission_studentId_fkey`;

-- DropForeignKey
ALTER TABLE `submission` DROP FOREIGN KEY `Submission_userId_fkey`;

-- DropForeignKey
ALTER TABLE `teacher` DROP FOREIGN KEY `Teacher_schoolId_fkey`;

-- DropForeignKey
ALTER TABLE `user` DROP FOREIGN KEY `User_schoolId_fkey`;

-- AlterTable
ALTER TABLE `homework` DROP COLUMN `userId`,
    MODIFY `teacherId` INTEGER NOT NULL;

-- AlterTable
ALTER TABLE `submission` DROP COLUMN `userId`,
    MODIFY `studentId` INTEGER NOT NULL;

-- AlterTable
ALTER TABLE `user` DROP COLUMN `schoolId`;

-- DropTable
DROP TABLE `_studentclassrooms`;

-- DropTable
DROP TABLE `_teacherclassrooms`;

-- DropTable
DROP TABLE `_userclassrooms`;

-- DropTable
DROP TABLE `classroom`;

-- DropTable
DROP TABLE `school`;

-- DropTable
DROP TABLE `student`;

-- DropTable
DROP TABLE `teacher`;

-- AddForeignKey
ALTER TABLE `Homework` ADD CONSTRAINT `Homework_teacherId_fkey` FOREIGN KEY (`teacherId`) REFERENCES `User`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `Submission` ADD CONSTRAINT `Submission_studentId_fkey` FOREIGN KEY (`studentId`) REFERENCES `User`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;
