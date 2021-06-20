import { UserType } from '@prisma/client';
import { extendType, idArg, list, nullable } from 'nexus';

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
      description: 'Get the current authenticated user object.',
      authorize: guard(
        authorized()
      ),
      resolve: (parent, args, { user, db }) => ensure(db.user.findUnique({
        where: { id: user!.id }
      }))
    });

    t.field('users', {
      type: list('User'),
      description: 'Get all registered users. Only accessible by roles: ADMIN.',
      authorize: guard(
        authorized(UserType.ADMIN)
      ),
      resolve: (parent, args, { db }) => db.user.findMany()
    });

    t.field('user', {
      type: nullable('User'),
      description: 'Get the details of the specified user. Only accessible by roles: ADMIN, CONTACT, CURRENT.',
      args: {
        id: idArg({
          description: 'The ID of the user. Must be a valid ID.'
        })
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
