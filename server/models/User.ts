import { list, nullable, objectType } from 'nexus';

export const User = objectType({
  name: 'User',
  definition: (t) => {
    t.id('id');
    t.string('email');

    t.field('type', {
      type: 'UserType'
    });

    t.field('customer', {
      type: nullable('Customer'),
      resolve: ({ id }, args, { db }) => db.user.findUnique({
        where: { id }
      }).customer()
    });
  }
});
