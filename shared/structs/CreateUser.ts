import { object, string } from 'superstruct';

import { Password } from './types/Password';

export const CreateUser = object({
  inviteId: string(),
  password: Password
});
