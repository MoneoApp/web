import { colors } from '../constants';

export function generatePalette(index: number) {
  let result = '';

  for (const [name, shades] of Object.entries(colors)) {
    for (const [shade, color] of Object.entries(shades)) {
      result = `${result}--${name}-${shade}: ${color?.[index]};`;
    }
  }

  return result;
}
