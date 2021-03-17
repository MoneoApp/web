import { css, SerializedStyles } from '@emotion/react';

import { Breakpoint, Breakpoints } from '../types';

import { withBreakpoint } from './withBreakpoint';

export function withBreakpoints<T>(
  breakpoints: Breakpoints<T>,
  getStyle: (value: T, breakpoint: Breakpoint) => SerializedStyles
) {
  let result: SerializedStyles | undefined;

  for (const key in breakpoints) {
    if (!breakpoints.hasOwnProperty(key)) {
      continue;
    }

    const br = key as Breakpoint;
    const value = breakpoints[br];

    if (value !== undefined) {
      result = css`
        ${result};
        ${withBreakpoint(br, getStyle(value, br))};
      `;
    }
  }

  return result;
}
