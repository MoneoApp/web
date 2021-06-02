import { define } from 'superstruct';
import isHexColor from 'validator/lib/isHexColor';

export const Color = define<string>('color', (value) => typeof value === 'string' && isHexColor(value));
