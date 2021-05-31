import { css } from '@emotion/react';
import styled from '@emotion/styled';
import { ReactNode } from 'react';
import { get, useFormContext } from 'react-hook-form';

import { errors } from '../../constants';

type Props = {
  name: string,
  big?: boolean,
  children?: ReactNode
};

export function ErrorHandler({ name, big = true, children }: Props) {
  const { formState: { errors: formErrors } } = useFormContext();

  console.log(formErrors);
  const error = get(formErrors, name);

  return (
    <StyledWrapper big={big} error={Boolean(error)}>
      {children}
      {error && (
        <StyledError>
          {errors[error.type] ?? 'Onbekende fout'}
        </StyledError>
      )}
    </StyledWrapper>
  );
}

const StyledWrapper = styled.div<{ big: boolean, error: boolean }>`
  position: relative;
  width: ${(props) => props.big ? '100%' : 'auto'};
  margin-bottom: 1rem;
  border-radius: 8px;

  ${(props) => props.error && css`
    background-color: var(--red-200);
    box-shadow: 0 0 0 3px var(--red-200);
  `};
`;

const StyledError = styled.div`
  margin: .25rem .75rem;
  color: white;
`;
