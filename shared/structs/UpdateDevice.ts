import { any, nullable, object, size, string } from 'superstruct';

export const UpdateDevice = object({
  id: string(),
  model: size(string(), 3, 70),
  brand: size(string(), 3, 70),
  image: nullable(any())
});
