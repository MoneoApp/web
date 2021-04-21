import { Context } from '../context';
import { Guard } from '../types';

export function guard(...guards: Guard[]) {
  return (parent: unknown, args: unknown, ctx: Context) => {
    for (const g of guards) {
      g(args, ctx);
    }

    return true;
  };
}
