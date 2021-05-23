import { array, number, object, size, string } from 'superstruct';

export const UpsertManualStep = object({
  text: size(string(), 3, 70),
  order: number(),
  interactionIds: array(string())
});
