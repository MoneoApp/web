import { ApolloError, toApolloError } from 'apollo-server-micro';
import { JSONObjectResolver } from 'graphql-scalars';
import { fieldAuthorizePlugin, makeSchema } from 'nexus';
import { join } from 'path';

import { Error } from '../shared/constants';

import { reflection } from './constants';
import * as features from './features';
import * as models from './models';
import * as enums from './models/enums';
import * as inputs from './models/inputs';

export const schema = makeSchema({
  types: {
    ...features,
    ...models,
    ...enums,
    ...inputs,
    JSONObject: JSONObjectResolver
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

        return toApolloError(error, Error.Unknown);
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
