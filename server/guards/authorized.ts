import { UserRole } from '@prisma/client';
import { ApolloError } from 'apollo-server-micro';

import { Error } from '../../shared/constants';
import { Guard } from '../types';

export function authorized(role: UserRole): Guard {
  return async (args, { userId, db }) => {
    const count = await db.user.count({
      where: {
        id: userId,
        role
      }
    })

    if (!count) {
      throw new ApolloError('unauthorized', Error.Unauthorized);
    }
  };
}
