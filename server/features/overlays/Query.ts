import { extendType, list, nullable } from 'nexus';

export const OverlayQuery = extendType({
  type: 'Query',
  definition: (t) => {
    t.field('overlays', {
      type: list('Overlay'),
      resolve: (parent, args, { db }) => db.overlay.findMany()
    });

    t.field('overlay', {
      type: nullable('Overlay'),
      args: {
        id: 'ID'
      },
      resolve: (parent, { id }, { db }) => db.overlay.findUnique({
        where: { id }
      })
    });
  }
});
