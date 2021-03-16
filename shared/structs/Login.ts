import { object } from 'superstruct';

import { Email } from './types/Email';
import { Password } from './types/Password';

export const Login = object({
  email: Email,
  password: Password
});
