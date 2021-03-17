import { ApolloError } from 'apollo-server-micro';
import { assert, Struct, StructError } from 'superstruct';

import { Error } from '../../shared/constants';
import { Guard } from '../types';

export function validate<T>(args: T, struct: Struct<T>): Guard {
  return () => {
    try {
      assert(args, struct);
    } catch (e) {
      if (e instanceof StructError) {
        throw new ApolloError('bad user input', Error.BadUserInput, {
          fields: e.failures().map(({ path, refinement, type }) => ({
            path,
            type: refinement ?? type
          }))
        });
      }

      throw e;
    }
  };
}
