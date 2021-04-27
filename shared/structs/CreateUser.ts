import { object } from 'superstruct';

import { Email } from './types/Email';

export const CreateUser = object({
  email: Email
});
