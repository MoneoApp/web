import { keyframes } from '@emotion/react';
import styled from '@emotion/styled';
import { DialoogProps } from 'dialoog';
import { ComponentPropsWithoutRef } from 'react';

type Props = {
  strict?: boolean
};

export function Dialog({
  strict = false,
  open,
  close,
  remove,
  index,
  children,
  ...props
}: Props & DialoogProps & ComponentPropsWithoutRef<'div'>) {
  return (
    <>
      <StyledBackdrop open={open} onClick={() => !strict && close()}/>
      <StyledDialog open={open} onAnimationEnd={() => !open && remove()} {...props}>
        {children}
      </StyledDialog>
    </>
  );
}

const fadeIn = keyframes`
  from {
    opacity: 0;
  }
  to {
    opacity: .25;
  }
`;

const fadeOut = keyframes`
  from {
    opacity: .25;
  }
  to {
    opacity: 0;
  }
`;

const jumpIn = keyframes`
  from {
    opacity: 0;
    transform: translate(-50%, -50%) scale(.95);
  }
  to {
    opacity: 1;
    transform: translate(-50%, -50%);
  }
`;

const jumpOut = keyframes`
  from {
    opacity: 1;
    transform: translate(-50%, -50%);
  }
  to {
    opacity: 0;
    transform: translate(-50%, -50%) scale(.95);
  }
`;

const StyledBackdrop = styled.div<{ open: boolean }>`
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background-color: var(--gray-300);
  animation: ${(props) => props.open ? fadeIn : fadeOut} .25s ease forwards;
  z-index: 500;
`;

const StyledDialog = styled.div<{ open: boolean }>`
  position: fixed;
  top: 50%;
  left: 50%;
  max-width: calc(100vw - 2rem);
  max-height: calc(100vh - 2rem);
  padding: 1.5rem;
  background-color: var(--gray-0);
  border-radius: 1rem;
  box-shadow: 0 0 4rem var(--gray-300);
  overflow-y: auto;
  animation: ${(props) => props.open ? jumpIn : jumpOut} .25s ease forwards;
  z-index: 550;
`;
