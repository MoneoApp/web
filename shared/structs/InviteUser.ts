import { object, string } from 'superstruct';

import { Email } from './types/Email';

export const InviteUser = object({
  customerId: string(),
  email: Email
});
