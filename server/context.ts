import { PrismaClient } from '@prisma/client';

export type Context = {
  db: PrismaClient,
  userId?: string
};
