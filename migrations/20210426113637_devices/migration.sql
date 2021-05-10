/*
  Warnings:

  - Added the required column `deviceId` to the `Overlay` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "Overlay" ADD COLUMN     "deviceId" TEXT NOT NULL;

-- CreateTable
CREATE TABLE "Device" (
    "id" TEXT NOT NULL,
    "model" TEXT NOT NULL,
    "brand" TEXT NOT NULL,
    "image" TEXT NOT NULL,
    "anchor" TEXT,
    "userId" TEXT NOT NULL,

    PRIMARY KEY ("id")
);

-- AddForeignKey
ALTER TABLE "Device" ADD FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Overlay" ADD FOREIGN KEY ("deviceId") REFERENCES "Device"("id") ON DELETE CASCADE ON UPDATE CASCADE;
