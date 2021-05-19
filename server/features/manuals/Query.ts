import { extendType, list, nullable } from 'nexus';

export const ManualQuery = extendType({
  type: 'Query',
  definition: (t) => {
    t.field('manuals', {
      type: list('Manual'),
      resolve: (parent, args, { db }) => db.manual.findMany()
    });

    t.field('manual', {
      type: nullable('Manual'),
      args: {
        id: 'ID'
      },
      resolve: (parent, { id }, { db }) => db.manual.findUnique({
        where: { id }
      })
    });
  }
});
