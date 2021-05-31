import { object, size, string } from 'superstruct';

export const CreateCustomer = object({
  name: size(string(), 3, 70)
});
