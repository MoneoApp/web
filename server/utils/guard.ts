import { Guard, GuardArgs } from '../types';

export function guard(args: GuardArgs) {
  return (...guards: Guard[]) => {
    for (const g of guards) {
      g(args);
    }

    return true;
  };
}
