import { extendType, list, nullable } from 'nexus';

import { whereSearch } from '../../utils/whereSearch';

export const ManualQuery = extendType({
  type: 'Query',
  definition: (t) => {
    t.field('manuals', {
      type: list('Manual'),
      args: {
        search: nullable('String')
      },
      resolve: (parent, { search }, { db }) => db.manual.findMany({
        where: whereSearch(search, 'title')
      })
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
