import { extendType, list, nullable } from 'nexus';

export const DeviceQuery = extendType({
  type: 'Query',
  definition: (t) => {
    t.field('devices', {
      type: list('Device'),
      resolve: (parent, args, { db }) => db.device.findMany()
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
