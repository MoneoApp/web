import { any, array, object, refine, size, string } from 'superstruct';

import { UpsertInteraction } from './UpsertInteraction';

export const CreateDevice = object({
  model: size(string(), 3, 70),
  brand: size(string(), 3, 70),
  image: refine(any(), 'truthy', (value) => Boolean(value)),
  type: string(),
  interactions: array(UpsertInteraction)
});
