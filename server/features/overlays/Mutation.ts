import { extendType, idArg, stringArg } from 'nexus';

import { CreateOverlay } from '../../../shared/structs/CreateOverlay';
import { authenticated } from '../../guards/authenticated';
import { validated } from '../../guards/validated';
import { guard } from '../../utils/guard';

export const OverlayMutation = extendType({
  type: 'Mutation',
  definition: (t) => {
    t.field('createOverlay', {
      type: 'Overlay',
      args: {
        name: stringArg(),
        deviceId: idArg()
      },
      authorize: guard(
        authenticated(),
        validated(CreateOverlay)
      ),
      resolve: (parent, { name, deviceId }, { db }) => db.overlay.create({
        data: {
          name,
          deviceId
        }
      })
    });
  }
});
