-- CreateTable
CREATE TABLE `_ViewedHomeworks` (
    `A` INTEGER NOT NULL,
    `B` INTEGER NOT NULL,

    UNIQUE INDEX `_ViewedHomeworks_AB_unique`(`A`, `B`),
    INDEX `_ViewedHomeworks_B_index`(`B`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- AddForeignKey
ALTER TABLE `_ViewedHomeworks` ADD CONSTRAINT `_ViewedHomeworks_A_fkey` FOREIGN KEY (`A`) REFERENCES `Homework`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `_ViewedHomeworks` ADD CONSTRAINT `_ViewedHomeworks_B_fkey` FOREIGN KEY (`B`) REFERENCES `User`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;
