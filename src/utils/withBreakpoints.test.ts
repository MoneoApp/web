import { css } from '@emotion/react';

import { breakpoints } from '../constants';

import { withBreakpoints } from './withBreakpoints';

it('should insert the correct breakpoints', () => {
  expect(withBreakpoints(breakpoints, (value) => css`
    content: "${value}";
  `)?.styles).toMatchSnapshot();
});
