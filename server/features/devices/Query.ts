import { UserType } from '@prisma/client';
import { extendType, idArg, list, nullable, stringArg } from 'nexus';

import { whereSearch } from '../../utils/whereSearch';

export const DeviceQuery = extendType({
  type: 'Query',
  definition: (t) => {
    t.field('devices', {
      type: list('Device'),
      description: 'Get all created devices.',
      args: {
        search: nullable(stringArg({
          description: 'If set, will filter the result on the brand or model field.'
        }))
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
      description: 'Get the details of the specified device.',
      args: {
        id: idArg({
          description: 'The ID of the device. Must be a valid ID.'
        })
      },
      resolve: (parent, { id }, { db }) => db.device.findUnique({
        where: { id }
      })
    });
  }
});
