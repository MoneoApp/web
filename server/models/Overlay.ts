import { objectType } from 'nexus';

export const Overlay = objectType({
  name: 'Overlay',
  definition: (t) => {
    t.id('id');
    t.string('name');

    t.list.field('interactions', {
      type: 'Interaction',
      resolve: ({ id }, args, { db }) => db.overlay.findUnique({
        where: { id }
      }).interactions()
    });
  }
});
