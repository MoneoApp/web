import { objectType } from 'nexus';

import { ensure } from '../utils/ensure';

export const Interaction = objectType({
  name: 'Interaction',
  definition: (t) => {
    t.id('id');
    t.float('x');
    t.float('y');
    t.float('width');
    t.float('height');
    t.string('text');

    t.field('overlay', {
      type: 'Overlay',
      resolve: ({ id }, args, { db }) => ensure(db.interaction.findUnique({
        where: { id }
      }).overlay())
    });

    t.list.field('blocks', {
      type: 'ContentBlock',
      resolve: ({ id }, args, { db }) => db.interaction.findUnique({
        where: { id }
      }).blocks()
    });
  }
});
