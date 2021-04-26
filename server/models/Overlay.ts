import { list, objectType } from 'nexus';

import { ensure } from '../utils/ensure';

export const Overlay = objectType({
  name: 'Overlay',
  definition: (t) => {
    t.id('id');
    t.string('name');

    t.field('device', {
      type: 'Device',
      resolve: ({ id }, args, { db }) => ensure(db.overlay.findUnique({
        where: { id }
      }).device())
    });

    t.field('interactions', {
      type: list('Interaction'),
      resolve: ({ id }, args, { db }) => db.overlay.findUnique({
        where: { id }
      }).interactions()
    });
  }
});
