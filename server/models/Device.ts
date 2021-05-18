import { list, objectType } from 'nexus';

import { ensure } from '../utils/ensure';

export const Device = objectType({
  name: 'Device',
  definition: (t) => {
    t.id('id');
    t.string('model');
    t.string('brand');
    t.string('image');

    t.field('user', {
      type: 'User',
      resolve: ({ id }, args, { db }) => ensure(db.device.findUnique({
        where: { id }
      }).user())
    });

    t.field('interactions', {
      type: list('Interaction'),
      resolve: ({ id }, args, { db }) => db.device.findUnique({
        where: { id }
      }).interactions()
    });

    t.field('manuals', {
      type: list('Manual'),
      resolve: ({ id }, args, { db }) => db.device.findUnique({
        where: { id }
      }).manuals()
    });
  }
});
