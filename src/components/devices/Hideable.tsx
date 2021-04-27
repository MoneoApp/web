import { css } from '@emotion/react';
import styled from '@emotion/styled';
import { ReactNode } from 'react';

import { useResizeObserver } from '../../hooks/useResizeObserver';

type Props = {
  hidden: boolean,
  children?: ReactNode
};

export function Hideable({ hidden, children }: Props) {
  const [ref, rect] = useResizeObserver();

  return (
    <StyledHideable hide={hidden} style={{ height: hidden ? 0 : rect?.height }}>
      <div ref={ref}>
        {children}
      </div>
    </StyledHideable>
  );
}

const StyledHideable = styled.div<{ hide: boolean }>`
  overflow: hidden;
  transform: none;
  transition: height .25s ease, opacity .25s ease, transform .25s ease, visibility;
  ${(props) => props.hide && css`
    opacity: 0;
    transform: scale(.95);
    visibility: hidden;
    transition-delay: 0s, 0s, 0s, .25s;
  `};
`;
