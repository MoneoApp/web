import { objectType } from 'nexus';

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

    t.list.field('interactions', {
      type: 'Interaction',
      resolve: ({ id }, args, { db }) => db.overlay.findUnique({
        where: { id }
      }).interactions()
    });
  }
});
