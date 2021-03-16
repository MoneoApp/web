import { object, size, string } from 'superstruct';

export const CreateOverlay = object({
  name: size(string(), 3)
});
