import { css } from '@emotion/react';

import { withBreakpoint } from './withBreakpoint';

const style = css`
  color: #ffba05;
`;

it('should insert the correct breakpoint', () => {
  expect(withBreakpoint('desktop', style).styles).toMatchSnapshot();
});

it('should skip the breakpoint on mobile', () => {
  expect(withBreakpoint('phone', style).styles).toMatchSnapshot();
});
