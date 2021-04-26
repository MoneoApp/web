import { objectType } from 'nexus';

export const User = objectType({
  name: 'User',
  definition: (t) => {
    t.id('id');
    t.string('email');
    t.string('role');

    t.list.field('devices', {
      type: 'Device',
      resolve: ({ id }, args, { db }) => db.user.findUnique({
        where: { id }
      }).devices()
    });
  }
});
