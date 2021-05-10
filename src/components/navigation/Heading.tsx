import { css } from '@emotion/react';
import styled from '@emotion/styled';

import { withBreakpoint } from '../../utils/withBreakpoint';

type Props = {
  text: string
};

export function Heading({ text }: Props) {
  return (
    <StyledHeading>
      {text}
    </StyledHeading>
  );
}

const StyledHeading = styled.h1`
  display: flex;
  align-items: center;
  height: 5rem;
  font-size: 1.5rem;
  font-weight: bold;

  ${withBreakpoint('tabletLandscape', css`
    height: 7.5rem;
  `)};

  ${withBreakpoint('laptop', css`
    height: 10rem;
    font-size: 2rem;
  `)};
`;
