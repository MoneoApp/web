import { objectType } from 'nexus';

import { ensure } from '../utils/ensure';

export const User = objectType({
  name: 'User',
  definition: (t) => {
    t.id('id');
    t.string('email');

    t.field('type', {
      type: 'UserType'
    });

    t.field('customer', {
      type: 'Customer',
      resolve: ({ id }, args, { db }) => ensure(db.user.findUnique({
        where: { id }
      }).customer())
    });
  }
});
