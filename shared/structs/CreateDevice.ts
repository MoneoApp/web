import { object, size, string } from 'superstruct';

export const CreateDevice = object({
  model: size(string(), 3, Infinity),
  brand: size(string(), 3, Infinity)
});