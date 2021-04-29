import { keyframes } from '@emotion/react';
import styled from '@emotion/styled';

export function Spinner() {
  return (
    <StyledDiv>
      <StyledSpinner />
    </StyledDiv>
  )
}

const StyledDiv = styled.div`
  display: flex;
  justify-content: center;
`;


const spin = keyframes`
  from {
    transform: rotate(0);
  }
  to {
    transform: rotate(360deg);
  }
`;

const StyledSpinner = styled.div`
    position: relative;
    width: 1.25rem;
    height: 1.25rem;
    margin: 4px;
    border: 4px solid var(--gray-500);
    border-radius: 50%;

    &::after {
      content: "";
      position: absolute;
      display: block;
      width: 1.75rem;
      height: 1.75rem;
      top: -8px;
      left: -8px;
      border: 4px solid transparent;
      border-left-color: var(--yellow-200);
      border-radius: 50%;
      animation: ${spin} .5s infinite linear;
    }
`;
