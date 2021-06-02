import { any, array, dynamic, never, object, optional, refine, size, string } from 'superstruct';

import { UpsertInteraction } from './UpsertInteraction';

export const CreateDevice = object({
  model: size(string(), 3, 70),
  brand: size(string(), 3, 70),
  image: refine(any(), 'truthy', (value) => Boolean(value)),
  type: string(),
  mlImages: dynamic((value: any) => {
   return value?.type === 'dynamic' ? optional(any()) : optional(any());
  }),
  interactions: array(UpsertInteraction)
});
