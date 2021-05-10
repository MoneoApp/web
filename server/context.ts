import { PrismaClient } from '@prisma/client';

import { TokenData } from '../shared/types';

export type Context = {
  db: PrismaClient,
  user?: TokenData
};
