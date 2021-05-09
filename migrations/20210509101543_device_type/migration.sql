/*
  Warnings:

  - You are about to drop the column `anchor` on the `Device` table. All the data in the column will be lost.

*/
-- CreateEnum
CREATE TYPE "DeviceType" AS ENUM ('STATIC', 'DYNAMIC');

-- AlterTable
ALTER TABLE "Device" DROP COLUMN "anchor",
ADD COLUMN     "type" "DeviceType" NOT NULL DEFAULT E'STATIC';
