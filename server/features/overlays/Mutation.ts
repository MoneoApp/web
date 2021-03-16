import { extendType, stringArg } from 'nexus';

import { CreateOverlay } from '../../../structs/CreateOverlay';
import { authorized } from '../../guards/authorized';
import { validate } from '../../guards/validate';

export const OverlayMutation = extendType({
  type: 'Mutation',
  definition: (t) => {
    t.field('createOverlay', {
      type: 'Overlay',
      args: {
        name: stringArg()
      },
      authorize: (parent, args, { guard }) => guard(
        authorized(),
        validate(args, CreateOverlay)
      ),
      resolve: (parent, { name }, { db }) => db.overlay.create({
        data: { name }
      })
    });
  }
});
