import { define } from 'superstruct';

const regex = /^(?=.*[a-z])(?=.*[A-Z])(?=.*[0-9]).{8,}$/;

export const Password = define<string>('password', (value) => typeof value === 'string' && regex.test(value));
