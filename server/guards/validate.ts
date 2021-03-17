import { Path } from 'react-hook-form';
import { assert, Struct, StructError } from 'superstruct';

import { Guard } from '../types';
import { inputError } from '../utils/inputError';

export function validate<T>(args: T, struct: Struct<T>): Guard {
  return () => {
    try {
      assert(args, struct);
    } catch (e) {
      if (e instanceof StructError) {
        throw inputError<T>(e.failures().map(({ path, refinement, type }) => ({
          path: path.join('.') as Path<T>,
          type: refinement ?? type
        })));
      }

      throw e;
    }
  };
}
