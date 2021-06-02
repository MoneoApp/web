import { number, object, optional, string } from 'superstruct';

export const UpsertInteraction = object({
  id: optional(string()),
  type: string(),
  x: number(),
  y: number(),
  width: number(),
  height: number(),
  rotation: number()
});
