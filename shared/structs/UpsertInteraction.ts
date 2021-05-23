import { assign, number, object, optional, string } from 'superstruct';

import { CreateInteraction } from './CreateInteraction';

export const UpsertInteraction = assign(CreateInteraction, object({
  id: optional(string()),
  type: string(),
  x: number(),
  y: number(),
  width: number(),
  height: number(),
  rotation: number()
}));
