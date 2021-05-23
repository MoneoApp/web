import { array, number, object, string } from 'superstruct';

export const UpsertManualStep = object({
  text: string(),
  order: number(),
  interactionIds: array(string())
});
