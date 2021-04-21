import { Path } from 'react-hook-form';
import { assert, Struct, StructError } from 'superstruct';

import { Guard } from '../types';
import { inputError } from '../utils/inputError';

export function validated(struct: Struct<any>): Guard {
  return (args) => {
    try {
      assert(args, struct);
    } catch (e) {
      if (e instanceof StructError) {
        throw inputError(e.failures().map(({ path, refinement, type }) => ({
          path: path.join('.') as Path<unknown>,
          type: refinement ?? type
        })));
      }

      throw e;
    }
  };
}
