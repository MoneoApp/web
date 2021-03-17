import { css } from '@emotion/react';

import { breakpoint } from './breakpoint';

const style = css`
  color: #ffba05;
`;

it('should insert the correct breakpoint', () => {
  expect(breakpoint('desktop', style).styles).toMatchSnapshot();
});

it('should skip the breakpoint on mobile', () => {
  expect(breakpoint('phone', style).styles).toMatchSnapshot();
});
