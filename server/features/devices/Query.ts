import { extendType, list, nullable } from 'nexus';

import { authorized } from '../../guards/authorized';
import { guard } from '../../utils/guard';

export const DeviceQuery = extendType({
  type: 'Query',
  definition: (t) => {
    t.field('devices', {
      type: list('Device'),
      authorize: guard(
        authorized()
      ),
      resolve: (parent, args, { db }) => db.device.findMany()
    });

    t.field('device', {
      type: nullable('Device'),
      args: {
        id: 'ID'
      },
      authorize: guard(
        authorized()
      ),
      resolve: (parent, { id }, { db }) => db.device.findUnique({
        where: { id }
      })
    });
  }
});
