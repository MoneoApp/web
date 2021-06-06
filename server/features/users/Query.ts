import { UserType } from '@prisma/client';
import { extendType, list, nullable } from 'nexus';

import { authorized } from '../../guards/authorized';
import { current } from '../../guards/current';
import { customer } from '../../guards/customer';
import { or } from '../../guards/or';
import { ensure } from '../../utils/ensure';
import { guard } from '../../utils/guard';

export const UserQuery = extendType({
  type: 'Query',
  definition: (t) => {
    t.field('me', {
      type: 'User',
      authorize: guard(
        authorized()
      ),
      resolve: (parent, args, { user, db }) => ensure(db.user.findUnique({
        where: { id: user!.id }
      }))
    });

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
        or(current(), authorized(UserType.ADMIN, UserType.CONTACT)),
        customer(({ id }) => ({
          users: {
            some: { id }
          }
        }))
      ),
      resolve: (parent, { id }, { db }) => db.user.findUnique({
        where: { id }
      })
    });
  }
});
