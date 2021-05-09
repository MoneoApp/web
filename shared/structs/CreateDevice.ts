import { object, size, string } from 'superstruct';

export const CreateDevice = object({
  model: size(string(), 3, 70),
  brand: size(string(), 3, 70),
  type: string()
});
