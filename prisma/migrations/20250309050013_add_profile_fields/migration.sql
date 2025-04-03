/*
  Warnings:

  - A unique constraint covering the columns `[discordId]` on the table `User` will be added. If there are existing duplicate values, this will fail.

*/
-- AlterTable
ALTER TABLE `user` ADD COLUMN `department` ENUM('BSFR', 'BSO', 'MPD', 'FHP', 'COMMS', 'FWC', 'CIV', 'FDLE', 'DEV', 'RNR', 'LEADERSHIP') NULL DEFAULT 'CIV',
    ADD COLUMN `discordId` VARCHAR(191) NULL,
    ADD COLUMN `rank` VARCHAR(30) NULL,
    ADD COLUMN `rnrStatus` ENUM('RNR_ADMINISTRATION', 'RNR_STAFF', 'RNR_MEMBER', 'NONE') NULL DEFAULT 'NONE';

-- CreateIndex
CREATE UNIQUE INDEX `User_discordId_key` ON `User`(`discordId`);
