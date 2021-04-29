import { css } from '@emotion/react';
import styled from '@emotion/styled';
import { faChevronDown } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { ComponentPropsWithoutRef } from 'react';
import { useFormContext } from 'react-hook-form';

import { errors } from '../../constants';

type Props<T> = {
  as?: T,
  name: string,
  label: string
};

export function Input<T extends keyof JSX.IntrinsicElements = 'input'>({
  name,
  label,
  ...props
}: Props<T> & ComponentPropsWithoutRef<T>) {
  const { register, formState: { errors: e, isSubmitting } } = useFormContext();

  const error = e[name];

  return (
    <StyledWrapper error={Boolean(error)}>
      <StyledLabel htmlFor={name}>
        {label}
      </StyledLabel>
      <StyledInput {...register(name)} id={name} disabled={isSubmitting} {...props}/>
      {props.as === 'select' && (
        <StyledIcon icon={faChevronDown}/>
      )}
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
  color: var(--gray-300);
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
  background-color: var(--gray-100);
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

const StyledIcon = styled(FontAwesomeIcon)`
  position: absolute;
  right: 1rem;
  top: 50%;
  transform: translateY(-50%);
  pointer-events: none;
`;

const StyledError = styled.div`
  margin: .25rem .75rem;
  color: white;
`;
