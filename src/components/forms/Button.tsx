import styled from '@emotion/styled';
import { ComponentPropsWithoutRef } from 'react';

type Props = {
  text: string
};

export function Button({ text, children }: Props & ComponentPropsWithoutRef<'button'>) {
  return (
    <StyledButton title={text}>
      {children ?? text}
    </StyledButton>
  );
}

const StyledButton = styled.button`
  padding: .5rem 1rem;
  color: white;
  background-color: var(--yellow-200);
  border-radius: 8px;
  font-size: .9rem;
  font-weight: bold;
  text-transform: uppercase;
  outline: none;
  transition: box-shadow .25s ease, opacity .25s ease;

  &:focus {
    box-shadow: 0 0 0 3px #fca311;
    z-index: 1;
  }

  &:disabled {
    pointer-events: none;
    opacity: .75;
  }
`;
