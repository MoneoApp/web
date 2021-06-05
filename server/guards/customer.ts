import { Prisma, UserType } from '@prisma/client';
import { ApolloError } from 'apollo-server-micro';

import { Error } from '../../shared/constants';
import { Guard } from '../types';

export function customer(where: (args: any) => Prisma.CustomerWhereInput): Guard {
  return async (args, { user, db }) => {
    if (user?.type === UserType.ADMIN) {
      return;
    }

    const count = await db.customer.count({
      where: {
        ...where(args),
        users: {
          some: { id: user!.id }
        }
      }
    });

    if (!count) {
      throw new ApolloError('unauthorized', Error.Unauthorized);
    }
  };
}
