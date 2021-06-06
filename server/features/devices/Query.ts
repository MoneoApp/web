import { UserType } from '@prisma/client';
import { extendType, list, nullable } from 'nexus';

import { whereSearch } from '../../utils/whereSearch';

export const DeviceQuery = extendType({
  type: 'Query',
  definition: (t) => {
    t.field('devices', {
      type: list('Device'),
      args: {
        search: nullable('String')
      },
      resolve: (parent, { search }, { db, user }) => db.device.findMany({
        where: {
          ...whereSearch(search, 'model', 'brand'),
          ...!user || user.type === UserType.ADMIN ? {} : {
            customer: {
              users: {
                some: { id: user.id }
              }
            }
          }
        }
      })
    });

    t.field('device', {
      type: nullable('Device'),
      args: {
        id: 'ID'
      },
      resolve: (parent, { id }, { db }) => db.device.findUnique({
        where: { id }
      })
    });
  }
});
