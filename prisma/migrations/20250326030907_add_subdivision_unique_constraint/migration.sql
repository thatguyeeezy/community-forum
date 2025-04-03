/*
  Warnings:

  - A unique constraint covering the columns `[name,departmentId]` on the table `SubdivisionInfo` will be added. If there are existing duplicate values, this will fail.

*/
-- CreateIndex
CREATE UNIQUE INDEX `SubdivisionInfo_name_departmentId_key` ON `SubdivisionInfo`(`name`, `departmentId`);
