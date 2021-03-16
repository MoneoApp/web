import { extendType } from 'nexus';

import { authorized } from '../../guards/authorized';

export const UserQuery = extendType({
  type: 'Query',
  definition: (t) => {
    t.list.field('users', {
      type: 'User',
      authorize: (parent, args, { guard }) => guard(
        authorized()
      ),
      resolve: (parent, args, { db }) => db.user.findMany()
    });
  }
});
