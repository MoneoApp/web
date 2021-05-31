import { any, array, nullable, object, size, string } from 'superstruct';

import { UpsertInteraction } from './UpsertInteraction';

export const UpdateDevice = object({
  id: string(),
  model: size(string(), 3, 70),
  brand: size(string(), 3, 70),
  image: nullable(any()),
  interactions: array(UpsertInteraction)
});
