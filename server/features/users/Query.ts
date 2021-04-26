import { extendType, list } from 'nexus';

import { authenticated } from '../../guards/authenticated';
import { guard } from '../../utils/guard';

export const UserQuery = extendType({
  type: 'Query',
  definition: (t) => {
    t.field('users', {
      type: list('User'),
      authorize: guard(
        authenticated()
      ),
      resolve: (parent, args, { db }) => db.user.findMany()
    });
  }
});
