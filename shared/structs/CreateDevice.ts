import { any, object, refine, size, string } from 'superstruct';

export const CreateDevice = object({
  model: size(string(), 3, 70),
  brand: size(string(), 3, 70),
  image: refine(any(), 'notNull', ((value) => value !== undefined)),
  type: string()
});
