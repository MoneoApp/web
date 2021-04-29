import { object, string } from 'superstruct';

import { Email } from './types/Email';

export const UpdateUser = object({
  id: string(),
  email: Email,
  role: string()
});
