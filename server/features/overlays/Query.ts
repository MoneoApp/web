import { extendType } from 'nexus';

import { authorized } from '../../guards/authorized';

export const OverlayQuery = extendType({
  type: 'Query',
  definition: (t) => {
    t.list.field('overlays', {
      type: 'Overlay',
      authorize: (parent, args, { guard }) => guard(
        authorized()
      ),
      resolve: (parent, args, { db }) => db.overlay.findMany()
    });
  }
});
