import { Guard } from '../types';

export function or(...guards: Guard[]): Guard {
  return (...args) => {
    let first: Error | undefined;

    for (const g of guards) {
      try {
        g(...args);

        return;
      } catch (e) {
        if (!first) {
          first = e;
        }
      }
    }

    throw first;
  };
}
