import { css } from '@emotion/react';
import styled from '@emotion/styled';
import React, { ComponentPropsWithoutRef } from 'react';

import { Breakpoints } from '../../types';
import { withBreakpoints } from '../../utils/withBreakpoints';

type Props = {
  sizes: Breakpoints<number | [number, number]>
};

export function Column(props: Props & ComponentPropsWithoutRef<'div'>) {
  return (
    <StyledColumn {...props}/>
  );
}

const StyledColumn = styled.div<Props>`
  position: relative;
  flex: 0 0 100%;
  flex-direction: column;

  ${(props) => withBreakpoints(props.sizes, (value) => {
    const [size, order] = typeof value === 'number' ? [value, 0] : value;
    const width = 100 / 12 * size;

    return width ? css`
      display: flex;
      flex-basis: ${width}%;
      order: ${order};
    ` : css`
      display: none;
    `;
  })};
`;
