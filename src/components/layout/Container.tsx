import { css } from '@emotion/react';
import styled from '@emotion/styled';
import React, { ComponentPropsWithoutRef } from 'react';

import { breakpoints } from '../../constants';
import { withBreakpoints } from '../../utils/withBreakpoints';

export function Container(props: ComponentPropsWithoutRef<'div'>) {
  return (
    <StyledContainer {...props}/>
  );
}

const StyledContainer = styled.div`
  display: flex;
  flex-direction: column;
  width: 100%;
  margin: 0 auto;
  padding: 0 1rem;

  ${withBreakpoints(breakpoints, (value) => css`
    width: calc(${value ? `${value - 1}rem` : '100%'} - 1rem);
  `)}
`;
