import { extendType } from 'nexus';

import { authenticated } from '../../guards/authenticated';
import { guard } from '../../utils/guard';

export const UserQuery = extendType({
  type: 'Query',
  definition: (t) => {
    t.list.field('users', {
      type: 'User',
      authorize: guard(
        authenticated()
      ),
      resolve: (parent, args, { db }) => db.user.findMany()
    });
  }
});
