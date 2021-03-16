import { css, SerializedStyles } from '@emotion/react';

import { breakpoints } from '../constants';
import { Breakpoint } from '../types';

export function breakpoint(br: Breakpoint, style: SerializedStyles) {
  if (br === 'phone') {
    return style;
  }

  return css`
    @media (min-width: ${breakpoints[br]}rem) {
      ${style};
    }
  `;
}
