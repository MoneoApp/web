/*
  Warnings:

  - Added the required column `deviceId` to the `Manual` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "Manual" ADD COLUMN     "deviceId" TEXT NOT NULL;

-- AddForeignKey
ALTER TABLE "Manual" ADD FOREIGN KEY ("deviceId") REFERENCES "Device"("id") ON DELETE CASCADE ON UPDATE CASCADE;
