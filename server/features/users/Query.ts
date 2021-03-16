import { extendType } from 'nexus';

export const UserQuery = extendType({
  type: 'Query',
  definition: (t) => {
    t.list.field('users', {
      type: 'User',
      authorize: () => false,
      resolve: (parent, args, { db }) => db.user.findMany()
    });
  }
});
