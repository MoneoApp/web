/*
  Warnings:

  - You are about to drop the `_InteractionToManualStep` table. If the table is not empty, all the data it contains will be lost.

*/
-- DropForeignKey
ALTER TABLE "_InteractionToManualStep" DROP CONSTRAINT "_InteractionToManualStep_A_fkey";

-- DropForeignKey
ALTER TABLE "_InteractionToManualStep" DROP CONSTRAINT "_InteractionToManualStep_B_fkey";

-- AlterTable
ALTER TABLE "ManualStep" ALTER COLUMN "order" DROP DEFAULT;

-- DropTable
DROP TABLE "_InteractionToManualStep";

-- CreateTable
CREATE TABLE "ManualStepInteraction" (
    "stepId" TEXT NOT NULL,
    "interactionId" TEXT NOT NULL,
    "color" TEXT NOT NULL,

    PRIMARY KEY ("stepId","interactionId")
);

-- AddForeignKey
ALTER TABLE "ManualStepInteraction" ADD FOREIGN KEY ("stepId") REFERENCES "ManualStep"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "ManualStepInteraction" ADD FOREIGN KEY ("interactionId") REFERENCES "Interaction"("id") ON DELETE CASCADE ON UPDATE CASCADE;
