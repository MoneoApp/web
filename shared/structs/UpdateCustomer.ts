import { object, size, string } from 'superstruct';

export const UpdateCustomer = object({
  id: string(),
  name: size(string(), 3, 70)
});
