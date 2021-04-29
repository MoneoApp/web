import { list, objectType } from 'nexus';

export const User = objectType({
  name: 'User',
  definition: (t) => {
    t.id('id');
    t.string('email');

    t.field('role', {
      type: 'UserRole'
    });

    t.field('devices', {
      type: list('Device'),
      resolve: ({ id }, args, { db }) => db.user.findUnique({
        where: { id }
      }).devices()
    });
  }
});
