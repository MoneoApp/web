import { css } from '@emotion/react';
import styled from '@emotion/styled';
import { ComponentPropsWithoutRef } from 'react';
import { useFormContext } from 'react-hook-form';

type Props = {
  name: string,
  label: string
};

export function Input({ name, label, ...props }: Props & ComponentPropsWithoutRef<'input'>) {
  const { register, formState: { errors, isSubmitting } } = useFormContext();

  const error = errors[name];

  return (
    <StyledWrapper error={Boolean(error)}>
      <StyledLabel htmlFor={name}>
        {label}
      </StyledLabel>
      <StyledInput {...register(name)} id={name} disabled={isSubmitting} {...props}/>
      {error && (
        <StyledError>
          error type: {error.type}
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
    background-color: #e21515;
    box-shadow: 0 0 0 3px #e21515;
  `};
`;

const StyledLabel = styled.label`
  position: absolute;
  top: .5rem;
  left: .75rem;
  color: grey;
  font-size: .75rem;
  font-weight: bold;
  text-transform: uppercase;
  pointer-events: none;
  z-index: 1;
`;

const StyledInput = styled.input`
  width: 100%;
  padding: 1.5rem .75rem .5rem;
  background-color: white;
  border-radius: inherit;
  outline: none;
  transition: box-shadow .25s ease, opacity .25s ease;

  &:focus {
    box-shadow: 0 0 0 3px #fca311;
    z-index: 1;
  }

  &:disabled {
    pointer-events: none;
    opacity: .5;
  }
`;

const StyledError = styled.div`
  margin: .25rem .75rem;
  color: white;
`;
