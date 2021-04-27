import { UserRole } from '@prisma/client';
import { extendType, stringArg } from 'nexus';

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
        model: stringArg(),
        brand: stringArg()
      },
      authorize: guard(
        authorized(UserRole.ADMIN),
        validated(CreateDevice)
      ),
      resolve: (parent, { model, brand }, { db, userId }) => db.device.create({
        data: {
          brand,
          model,
          image: 'unknown',
          userId: userId!
        }
      })
    });
  }
});