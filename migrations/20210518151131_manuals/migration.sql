/*
  Warnings:

  - You are about to drop the column `overlayId` on the `Interaction` table. All the data in the column will be lost.
  - You are about to drop the `ContentBlock` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `Overlay` table. If the table is not empty, all the data it contains will be lost.
  - Added the required column `description` to the `Interaction` table without a default value. This is not possible if the table is not empty.
  - Added the required column `deviceId` to the `Interaction` table without a default value. This is not possible if the table is not empty.

*/
-- DropForeignKey
ALTER TABLE "ContentBlock" DROP CONSTRAINT "ContentBlock_interactionId_fkey";

-- DropForeignKey
ALTER TABLE "Overlay" DROP CONSTRAINT "Overlay_deviceId_fkey";

-- DropForeignKey
ALTER TABLE "Interaction" DROP CONSTRAINT "Interaction_overlayId_fkey";

-- AlterTable
ALTER TABLE "Interaction" DROP COLUMN "overlayId",
ADD COLUMN     "description" TEXT NOT NULL,
ADD COLUMN     "deviceId" TEXT NOT NULL;

-- DropTable
DROP TABLE "ContentBlock";

-- DropTable
DROP TABLE "Overlay";

-- DropEnum
DROP TYPE "ContentBlockType";

-- CreateTable
CREATE TABLE "Manual" (
    "id" TEXT NOT NULL,
    "title" TEXT NOT NULL,

    PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "ManualStep" (
    "id" TEXT NOT NULL,
    "text" TEXT NOT NULL,
    "manualId" TEXT NOT NULL,

    PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "_InteractionToManualStep" (
    "A" TEXT NOT NULL,
    "B" TEXT NOT NULL
);

-- CreateIndex
CREATE UNIQUE INDEX "_InteractionToManualStep_AB_unique" ON "_InteractionToManualStep"("A", "B");

-- CreateIndex
CREATE INDEX "_InteractionToManualStep_B_index" ON "_InteractionToManualStep"("B");

-- AddForeignKey
ALTER TABLE "ManualStep" ADD FOREIGN KEY ("manualId") REFERENCES "Manual"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "_InteractionToManualStep" ADD FOREIGN KEY ("A") REFERENCES "Interaction"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "_InteractionToManualStep" ADD FOREIGN KEY ("B") REFERENCES "ManualStep"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Interaction" ADD FOREIGN KEY ("deviceId") REFERENCES "Device"("id") ON DELETE CASCADE ON UPDATE CASCADE;
