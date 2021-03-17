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
  background-color: white;
  border-radius: 1000px;
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
