/*
  Warnings:

  - You are about to drop the column `isAnnouncement` on the `category` table. All the data in the column will be lost.
  - You are about to drop the column `minRole` on the `category` table. All the data in the column will be lost.

*/
-- AlterTable
ALTER TABLE `category` DROP COLUMN `isAnnouncement`,
    DROP COLUMN `minRole`,
    ADD COLUMN `parentId` INTEGER NULL;

-- AddForeignKey
ALTER TABLE `Category` ADD CONSTRAINT `Category_parentId_fkey` FOREIGN KEY (`parentId`) REFERENCES `Category`(`id`) ON DELETE SET NULL ON UPDATE CASCADE;
