import { number, object, optional, size, string } from 'superstruct';

export const UpsertInteraction = object({
  id: optional(string()),
  field: string(),
  x: number(),
  y: number(),
  width: number(),
  height: number(),
  rotation: number(),
  title: size(string(), 3, 70),
  description: size(string(), 3, 140)
});
