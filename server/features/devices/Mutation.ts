import { extendType } from 'nexus';

import { CreateDevice } from '../../../shared/structs/CreateDevice';
import { authorized } from '../../guards/authorized';
import { validated } from '../../guards/validated';
import { guard } from '../../utils/guard';

export const DeviceMutation = extendType({
  type: 'Mutation',
  definition: (t) => {
    t.field('createDevice', {
      type: 'Device',
      args: {
        model: 'String',
        brand: 'String',
        type: 'DeviceType'
      },
      authorize: guard(
        authorized(),
        validated(CreateDevice)
      ),
      resolve: (parent, { model, brand, type }, { db, user }) => db.device.create({
        data: {
          model,
          brand,
          image: 'unknown',
          type,
          userId: user!.id
        }
      })
    });
  }
});
