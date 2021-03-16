import { PrismaClient } from '@prisma/client';

import { guard } from './utils/guard';

export type Context = {
  db: PrismaClient,
  userId?: string,
  guard: ReturnType<typeof guard>
};
