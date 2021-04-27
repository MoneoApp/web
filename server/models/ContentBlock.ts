import { objectType } from 'nexus';

import { ensure } from '../utils/ensure';

export const ContentBlock = objectType({
  name: 'ContentBlock',
  definition: (t) => {
    t.id('id');
    t.field('type', { type: 'ContentBlockType' });
    t.field('data', { type: 'JSONObject' });

    t.field('interaction', {
      type: 'Interaction',
      resolve: ({ id }, args, { db }) => ensure(db.contentBlock.findUnique({
        where: { id }
      }).interaction())
    });
  }
});
