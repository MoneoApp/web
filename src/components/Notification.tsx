import { keyframes } from '@emotion/react';
import styled from '@emotion/styled';
import { DialoogProps, useDialoog } from 'dialoog';

import { useTimeout } from '../hooks/useTimeout';

type Props = {
  message: string,
  timeout: number
};

export function Notification({ message, timeout, index, open, close, remove }: Props & DialoogProps) {
  const [{ dialogs }] = useDialoog();

  useTimeout(timeout, close, []);

  const total = dialogs.filter((dialog) => dialog.stack === 'notifications').length - 1;

  return (
    <StyledNotification index={total - index} open={open} onClick={close} onAnimationEnd={() => !open && remove()}>
      {message}
    </StyledNotification>
  );
}

const slideIn = keyframes`
  from {
    transform: translateX(calc(-100% - 2rem));
  }
  to {
    transform: none;
  }
`;

const slideOut = keyframes`
  from {
    transform: none;
  }
  to {
    transform: translateX(calc(-100% - 2rem));
  }
`;

const StyledNotification = styled.button<{ index: number, open: boolean }>`
  position: fixed;
  display: flex;
  align-items: center;
  bottom: ${(props) => props.index * 4 + 1}rem;
  left: 1rem;
  max-width: calc(100% - 2rem);
  height: 3rem;
  padding: 0 1rem;
  background-color: var(--grey-0);
  border-radius: 8px;
  transition: bottom .25s ease, box-shadow .25s ease;
  animation: ${(props) => props.open ? slideIn : slideOut} .25s ease;
  outline: none;
  z-index: 150;

  &:hover {
    cursor: pointer;
  }

  &:focus {
    box-shadow: 0 0 0 3px var(--yellow-200);
  }
`;
