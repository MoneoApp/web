import { PrismaClient } from '@prisma/client';
import { ApolloServer } from 'apollo-server-micro';

import { schema } from './schema';

const prisma = new PrismaClient({
  log: ['query']
});

export const server = new ApolloServer({
  schema,
  context: () => ({ db: prisma })
});
