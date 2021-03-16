import { define } from 'superstruct';
import isEmail from 'validator/lib/isEmail';

export const Email = define<string>('email', (value) => typeof value === 'string' && isEmail(value));
