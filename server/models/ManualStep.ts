import { list, objectType } from 'nexus';

import { ensure } from '../utils/ensure';

export const ManualStep = objectType({
  name: 'ManualStep',
  definition: (t) => {
    t.id('id');
    t.string('text');
    t.int('order');

    t.field('manual', {
      type: 'Manual',
      resolve: ({ id }, args, { db }) => ensure(db.manualStep.findUnique({
        where: { id }
      }).manual())
    });

    t.field('interactions', {
      type: list('Interaction'),
      resolve: async ({ id }, args, { db }) => {
        const interactions = await db.manualStepInteraction.findMany({
          where: { stepId: id },
          include: { interaction: true }
        });

        return interactions.map(({ color, interaction }) => ({
          ...interaction,
          color
        }));
      }
    });
  }
});
