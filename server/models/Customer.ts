import { list, objectType } from 'nexus';

export const Customer = objectType({
  name: 'Customer',
  definition: (t) => {
    t.id('id');
    t.string('name');

    t.field('users', {
      type: list('User'),
      resolve: ({ id }, args, { db }) => db.customer.findUnique({
        where: { id }
      }).users()
    });

    t.field('devices', {
      type: list('Device'),
      resolve: ({ id }, args, { db }) => db.customer.findUnique({
        where: { id }
      }).devices()
    });
  }
});
