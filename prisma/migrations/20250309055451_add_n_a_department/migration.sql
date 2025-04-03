-- AlterTable
ALTER TABLE `user` MODIFY `department` ENUM('BSFR', 'BSO', 'MPD', 'FHP', 'COMMS', 'FWC', 'CIV', 'FDLE', 'DEV', 'RNR', 'LEADERSHIP', 'N_A') NULL DEFAULT 'N_A';
