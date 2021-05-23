-- AlterTable
CREATE SEQUENCE "manualstep_order_seq";
ALTER TABLE "ManualStep" ALTER COLUMN "order" SET DEFAULT nextval('manualstep_order_seq');
ALTER SEQUENCE "manualstep_order_seq" OWNED BY "ManualStep"."order";
