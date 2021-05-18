import { list, objectType } from 'nexus';

import { ensure } from '../utils/ensure';

export const Manual = objectType({
  name: 'Manual',
  definition: (t) => {
    t.id('id');
    t.string('title');

    t.field('device', {
      type: 'Device',
      resolve: ({ id }, args, { db }) => ensure(db.manual.findUnique({
        where: { id }
      }).device())
    });

    t.field('steps', {
      type: list('ManualStep'),
      resolve: ({ id }, args, { db }) => db.manual.findUnique({
        where: { id }
      }).steps()
    });
  }
})
