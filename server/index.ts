import { PrismaClient } from '@prisma/client';
import { ApolloServer } from 'apollo-server-micro';
import { IncomingMessage } from 'http';
import { verify } from 'jsonwebtoken';

import { TokenData } from '../shared/types';

import { secret } from './constants';
import { schema } from './schema';

const db = new PrismaClient({
  log: ['query']
});

export const server = new ApolloServer({
  schema,
  context: async ({ req }: { req: IncomingMessage }) => {
    let user: TokenData | undefined;
    const token = req.headers.authorization?.substr(7);

    try {
      user = verify(token ?? '', secret) as TokenData;
    } catch {
    }

    return {
      db,
      user
    };
  }
});
