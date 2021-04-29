import { object } from 'superstruct';

import { Email } from './types/Email';

export const InviteUser = object({
  email: Email
});
