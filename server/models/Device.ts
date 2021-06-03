import { list, objectType } from 'nexus';

import { ensure } from '../utils/ensure';

export const Device = objectType({
  name: 'Device',
  definition: (t) => {
    t.id('id');
    t.string('model');
    t.string('brand');
    t.string('image');
    t.field('type', { type: 'DeviceType' });

    t.field('customer', {
      type: 'Customer',
      resolve: ({ id }, args, { db }) => ensure(db.device.findUnique({
        where: { id }
      }).customer())
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
