import { object, size, string } from 'superstruct';

import { Email } from './types/Email';

export const CreateCustomer = object({
  name: size(string(), 3, 70),
  email: Email
});
