import { Context } from '../context';
import { Guard } from '../types';

export function guard(...guards: Guard[]) {
  return async (parent: unknown, args: unknown, ctx: Context) => {
    for (const g of guards) {
      await g(args, ctx);
    }

    return true;
  };
}
