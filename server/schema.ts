import { ApolloError, toApolloError } from 'apollo-server-micro';
import { fieldAuthorizePlugin, makeSchema } from 'nexus';
import { join } from 'path';

import { reflection } from './constants';
import * as features from './features';
import * as models from './models';

export const schema = makeSchema({
  types: {
    ...features,
    ...models
  },
  outputs: {
    typegen: join(__dirname, '..', 'node_modules', '@types', 'nexus__typegen', 'index.d.ts'),
    schema: join(__dirname, '..', 'schema.graphql')
  },
  plugins: [
    fieldAuthorizePlugin({
      formatError: ({ error }) => {
        if (error instanceof ApolloError) {
          return error;
        }

        return toApolloError(error);
      }
    })
  ],
  nonNullDefaults: {
    input: true,
    output: true
  },
  contextType: {
    module: require.resolve('./context'),
    export: 'Context'
  },
  shouldGenerateArtifacts: reflection,
  shouldExitAfterGenerateArtifacts: true
});
