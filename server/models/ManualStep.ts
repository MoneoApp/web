import { list, objectType } from 'nexus';

import { ensure } from '../utils/ensure';

export const ManualStep = objectType({
  name: 'ManualStep',
  definition: (t) => {
    t.id('id');
    t.string('text');

    t.field('manual', {
      type: 'Manual',
      resolve: ({ id }, args, { db }) => ensure(db.manualStep.findUnique({
        where: { id }
      }).manual())
    });

    t.field('interactions', {
      type: list('Interaction'),
      resolve: ({ id }, args, { db }) => db.manualStep.findUnique({
        where: { id }
      }).interactions()
    });
  }
})
