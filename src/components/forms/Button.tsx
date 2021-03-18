import styled from '@emotion/styled';
import { ComponentPropsWithoutRef, forwardRef } from 'react';

import { ColorPalette } from '../../types';
import { withPalette } from '../../utils/withPalette';

type Props = {
  as?: keyof JSX.IntrinsicElements,
  text: string,
  palette?: ColorPalette
};

export const Button = forwardRef<HTMLButtonElement, Props & ComponentPropsWithoutRef<'button'>>((props, ref) => (
  <StyledButton ref={ref} title={props.text} {...props}>
    {props.children ?? props.text}
  </StyledButton>
));

const StyledButton = styled.button<Props>`
  padding: .5rem 1rem;
  color: white;
  background-color: var(--yellow-200);
  border-radius: 8px;
  font-size: .9rem;
  font-weight: bold;
  text-transform: uppercase;
  text-decoration: none;
  outline: none;
  transition: color .25s ease, background-color .25s ease, box-shadow .25s ease, opacity .25s ease;

  &:focus {
    box-shadow: 0 0 0 3px var(--yellow-300);
    z-index: 1;
  }

  &:disabled {
    pointer-events: none;
    opacity: .75;
  }

  ${(props) => withPalette(props.palette)};
`;
