import { extendType } from 'nexus';

import { authorized } from '../../guards/authorized';
import { guard } from '../../utils/guard';

export const UserQuery = extendType({
  type: 'Query',
  definition: (t) => {
    t.list.field('users', {
      type: 'User',
      authorize: guard(
        authorized()
      ),
      resolve: (parent, args, { db }) => db.user.findMany()
    });
  }
});
