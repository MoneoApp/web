import { css } from '@emotion/react';
import styled from '@emotion/styled';
import { ComponentPropsWithoutRef } from 'react';
import { useFormContext } from 'react-hook-form';

import { errors } from '../../constants';

type Props = {
  name: string,
  label: string
};

export function Input({ name, label, ...props }: Props & ComponentPropsWithoutRef<'input'>) {
  const { register, formState: { errors: e, isSubmitting } } = useFormContext();

  const error = e[name];

  return (
    <StyledWrapper error={Boolean(error)}>
      <StyledLabel htmlFor={name}>
        {label}
      </StyledLabel>
      <StyledInput {...register(name)} id={name} disabled={isSubmitting} {...props}/>
      {error && (
        <StyledError>
          {errors[error.type] ?? 'Onbekende fout'}
        </StyledError>
      )}
    </StyledWrapper>
  );
}

const StyledWrapper = styled.div<{ error: boolean }>`
  position: relative;
  width: 100%;
  margin-bottom: 1rem;
  border-radius: 8px;

  ${(props) => props.error && css`
    background-color: var(--red-200);
    box-shadow: 0 0 0 3px var(--red-200);
  `};
`;

const StyledLabel = styled.label`
  position: absolute;
  top: .5rem;
  left: .75rem;
  color: var(--grey-300);
  font-size: .75rem;
  font-weight: bold;
  text-transform: uppercase;
  pointer-events: none;
  z-index: 1;
`;

const StyledInput = styled.input`
  width: 100%;
  min-width: 0;
  padding: 1.5rem .75rem .5rem;
  background-color: var(--grey-100);
  border-radius: inherit;
  outline: none;
  transition: box-shadow .25s ease, opacity .25s ease;

  &:focus {
    box-shadow: 0 0 0 3px var(--yellow-300);
    z-index: 1;
  }

  &:disabled {
    pointer-events: none;
    opacity: .75;
  }
`;

const StyledError = styled.div`
  margin: .25rem .75rem;
  color: white;
`;
