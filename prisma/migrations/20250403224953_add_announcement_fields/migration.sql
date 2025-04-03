/*
  Warnings:

  - You are about to drop the column `parentId` on the `category` table. All the data in the column will be lost.

*/
-- DropForeignKey
ALTER TABLE `category` DROP FOREIGN KEY `Category_parentId_fkey`;

-- DropIndex
DROP INDEX `Category_parentId_fkey` ON `category`;

-- AlterTable
ALTER TABLE `category` DROP COLUMN `parentId`,
    ADD COLUMN `isAnnouncement` BOOLEAN NOT NULL DEFAULT false,
    ADD COLUMN `minRole` ENUM('HEAD_ADMIN', 'SENIOR_ADMIN', 'ADMIN', 'JUNIOR_ADMIN', 'SENIOR_STAFF', 'STAFF', 'STAFF_IN_TRAINING', 'MEMBER', 'APPLICANT') NOT NULL DEFAULT 'APPLICANT';
