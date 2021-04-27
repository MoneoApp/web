import { extendType, list } from 'nexus';

import { authorized } from '../../guards/authorized';
import { guard } from '../../utils/guard';

export const OverlayQuery = extendType({
  type: 'Query',
  definition: (t) => {
    t.field('overlays', {
      type: list('Overlay'),
      authorize: guard(
        authorized()
      ),
      resolve: (parent, args, { db }) => db.overlay.findMany()
    });
  }
});
