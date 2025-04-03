/*
  Warnings:

  - A unique constraint covering the columns `[name]` on the table `DepartmentInfo` will be added. If there are existing duplicate values, this will fail.

*/
-- CreateIndex
CREATE UNIQUE INDEX `DepartmentInfo_name_key` ON `DepartmentInfo`(`name`);
