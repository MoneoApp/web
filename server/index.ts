import { PrismaClient } from '@prisma/client';
import { ApolloServer } from 'apollo-server-micro';
import { IncomingMessage } from 'http';
import { verify } from 'jsonwebtoken';

import { secret } from './constants';
import { schema } from './schema';
import { guard } from './utils/guard';

const db = new PrismaClient({
  log: ['query']
});

export const server = new ApolloServer({
  schema,
  context: async ({ req }: { req: IncomingMessage }) => {
    let userId: string | undefined;
    const token = req.headers.authorization?.substr(7);

    try {
      userId = verify(token ?? '', secret) as string;
    } catch {
    }

    const ctx = {
      db,
      userId
    };

    (ctx as any).guard = guard(ctx);

    return ctx;
  }
});
