import { objectType } from 'nexus';

import { ensure } from '../utils/ensure';

export const Interaction = objectType({
  name: 'Interaction',
  definition: (t) => {
    t.id('id');
    t.field('type', { type: 'InteractionType' });
    t.float('x');
    t.float('y');
    t.float('width');
    t.float('height');
    t.float('rotation');
    t.nullable.string('color');

    t.field('device', {
      type: 'Device',
      resolve: ({ id }, args, { db }) => ensure(db.interaction.findUnique({
        where: { id }
      }).device())
    });
  }
});
