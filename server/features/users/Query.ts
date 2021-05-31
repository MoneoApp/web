import { UserType } from '@prisma/client';
import { extendType, list, nullable } from 'nexus';

import { authorized } from '../../guards/authorized';
import { guard } from '../../utils/guard';

export const UserQuery = extendType({
  type: 'Query',
  definition: (t) => {
    t.field('users', {
      type: list('User'),
      authorize: guard(
        authorized(UserType.ADMIN)
      ),
      resolve: (parent, args, { db }) => db.user.findMany()
    });

    t.field('user', {
      type: nullable('User'),
      args: {
        id: 'ID'
      },
      authorize: guard(
        authorized(UserType.ADMIN)
      ),
      resolve: (parent, { id }, { db }) => db.user.findUnique({
        where: { id }
      })
    });
  }
});
