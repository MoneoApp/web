import { UserRole } from '@prisma/client';
import { extendType } from 'nexus';

import { authorized } from '../../guards/authorized';
import { guard } from '../../utils/guard';

export const DeviceQuery = extendType({
  type: 'Query',
  definition: (t) => {
    t.list.field('devices', {
      type: 'Device',
      authorize: guard(
        authorized(UserRole.ADMIN)
      ),
      resolve: (parent, args, { db }) => db.device.findMany()
    });
  }
});
