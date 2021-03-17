import { css } from '@emotion/react';
import styled from '@emotion/styled';
import React, { ComponentPropsWithoutRef } from 'react';

import { Breakpoints } from '../../types';
import { withBreakpoints } from '../../utils/withBreakpoints';

type Props = {
  spacing?: Breakpoints<number | [number, number]>
};

export function Row(props: Props & ComponentPropsWithoutRef<'div'>) {
  return (
    <StyledRow {...props}/>
  );
}

const StyledRow = styled.div<Props>`
  display: flex;
  flex-wrap: wrap;

  ${(props) => props.spacing && withBreakpoints(props.spacing, (value) => {
    const [x, y] = typeof value === 'number' ? [value, value] : value;

    return css`
      margin: -${y / 2}rem -${x / 2}rem;

      & > * {
        padding: ${y / 2}rem ${x / 2}rem;
      }
    `;
  })};
`;
