import { UserRole } from '@prisma/client';
import { extendType, idArg, nullable } from 'nexus';

import { authorized } from '../../guards/authorized';
import { guard } from '../../utils/guard';

export const UserQuery = extendType({
  type: 'Query',
  definition: (t) => {
    t.list.field('users', {
      type: 'User',
      authorize: guard(
        authorized(UserRole.ADMIN)
      ),
      resolve: (parent, args, { db }) => db.user.findMany()
    });

    t.field('user', {
      type: nullable('User'),
      args: {
        id: idArg()
      },
      authorize: guard(
        authorized(UserRole.ADMIN)
      ),
      resolve: (parent, { id }, { db }) => db.user.findUnique({
        where: { id }
      })
    });
  }
});
