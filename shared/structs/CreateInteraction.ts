import { object, size, string } from 'superstruct';

export const CreateInteraction = object({
  title: size(string(), 3, 70),
  description: size(string(), 3, 70)
});
