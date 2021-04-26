import { extendType } from 'nexus';

import { authenticated } from '../../guards/authenticated';
import { guard } from '../../utils/guard';

export const OverlayQuery = extendType({
  type: 'Query',
  definition: (t) => {
    t.list.field('overlays', {
      type: 'Overlay',
      authorize: guard(
        authenticated()
      ),
      resolve: (parent, args, { db }) => db.overlay.findMany()
    });
  }
});
