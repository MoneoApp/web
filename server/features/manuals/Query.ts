import { extendType, idArg, list, nullable, stringArg } from 'nexus';

import { whereSearch } from '../../utils/whereSearch';

export const ManualQuery = extendType({
  type: 'Query',
  definition: (t) => {
    t.field('manuals', {
      type: list('Manual'),
      description: 'Get all created manuals.',
      args: {
        search: nullable(stringArg({
          description: 'If set, will filter the result on the title field.'
        }))
      },
      resolve: (parent, { search }, { db }) => db.manual.findMany({
        where: whereSearch(search, 'title')
      })
    });

    t.field('manual', {
      type: nullable('Manual'),
      description: 'Get the details of the specified manual.',
      args: {
        id: idArg({
          description: 'The ID of the manual. Must be a valid ID.'
        })
      },
      resolve: (parent, { id }, { db }) => db.manual.findUnique({
        where: { id }
      })
    });
  }
});
