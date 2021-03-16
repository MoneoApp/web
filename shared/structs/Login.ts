import { object } from 'superstruct';

import { Email } from './refinements/Email';
import { Password } from './refinements/Password';

export const Login = object({
  email: Email,
  password: Password
});
