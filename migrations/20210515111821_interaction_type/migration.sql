/*
  Warnings:

  - Added the required column `type` to the `Interaction` table without a default value. This is not possible if the table is not empty.

*/
-- CreateEnum
CREATE TYPE "InteractionType" AS ENUM ('SQUARE', 'CIRCLE');

-- AlterTable
ALTER TABLE "Interaction" ADD COLUMN     "type" "InteractionType" NOT NULL;
