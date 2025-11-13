/*
  Warnings:

  - You are about to drop the column `code` on the `QRCode` table. All the data in the column will be lost.
  - You are about to drop the `CompletedLevel` table. If the table is not empty, all the data it contains will be lost.
  - A unique constraint covering the columns `[flag]` on the table `QRCode` will be added. If there are existing duplicate values, this will fail.
  - Added the required column `flag` to the `QRCode` table without a default value. This is not possible if the table is not empty.

*/
-- DropForeignKey
ALTER TABLE `CompletedLevel` DROP FOREIGN KEY `CompletedLevel_teamId_fkey`;

-- DropIndex
DROP INDEX `QRCode_code_key` ON `QRCode`;

-- AlterTable
ALTER TABLE `QRCode` DROP COLUMN `code`,
    ADD COLUMN `flag` VARCHAR(191) NOT NULL;

-- DropTable
DROP TABLE `CompletedLevel`;

-- CreateIndex
CREATE UNIQUE INDEX `QRCode_flag_key` ON `QRCode`(`flag`);
