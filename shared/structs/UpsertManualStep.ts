import { array, number, object, size, string } from 'superstruct';

import { Color } from './types/Color';

export const UpsertManualStep = object({
  text: size(string(), 3, 140),
  order: number(),
  interactions: size(array(object({
    id: string(),
    color: Color
  })), 1, Infinity)
});
