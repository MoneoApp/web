import styled from '@emotion/styled';
import { IconProp } from '@fortawesome/fontawesome-svg-core';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { Fragment } from 'react';
import { useFormContext } from 'react-hook-form';

import { ColorShade } from '../../types';
import { errors } from '../../constants';

type Props = {
  name: string,
  label: string,
  options: {
    value: string,
    icon: IconProp,
    description: string,
    color: ColorShade
  }[]
};

export function BigRadio({ name, label, options }: Props) {
  const { register, formState: { errors: e, isSubmitting } } = useFormContext();

  const error = e[name];

  return (
    <>
      <StyledTitle>
        {label}
        {error && (
          <StyledError>
            {errors[error.type] ?? 'Onbekende fout'}
          </StyledError>
        )}
      </StyledTitle>
      {options.map((option, i) => (
        <Fragment key={option.value}>
          <StyledWrapper>
            <StyledInput
              type="radio"
              id={option.value}
              value={option.value}
              shade={option.color}
              disabled={isSubmitting}
              {...register(name)}
            />
            <StyledLabel htmlFor={option.value}>
              <StyledIconWrapper>
                <FontAwesomeIcon icon={option.icon} size="5x" fixedWidth={true}/>
              </StyledIconWrapper>
              {option.description}
            </StyledLabel>
          </StyledWrapper>
          {i < options.length - 1 && (
            <StyledSeparator>
              OF
            </StyledSeparator>
          )}
        </Fragment>
      ))}
    </>
  );
}

const StyledTitle = styled.div`
  margin: 0 0 1rem .75rem;
`;

const StyledError = styled.span`
  margin-left: .75rem;
  padding: .25rem .5rem;
  background-color: var(--red-200);
  border-radius: 4px;
`;

const StyledWrapper = styled.div`
  display: flex;
`;

const StyledInput = styled.input<{ shade: ColorShade }>`
  &:focus ~ label > div {
    box-shadow: 0 0 0 3px var(--yellow-300);
    z-index: 1;
  }

  &:checked ~ label > div {
    background-color: var(--${(props) => props.shade});
  }
`;

const StyledLabel = styled.label`
  display: flex;

  &:hover {
    cursor: pointer;
  }
`;

const StyledIconWrapper = styled.div`
  display: flex;
  align-items: center;
  height: 8.25rem;
  margin-right: 1rem;
  padding: 1rem;
  color: var(--gray-0);
  background-color: var(--gray-300);
  border-radius: 8px;
  transition: box-shadow .25s ease, background-color .25s ease;
`;

const StyledSeparator = styled.div`
  display: flex;
  justify-content: center;
  width: 8.25rem;
  margin: 1rem 0;
  color: var(--gray-300);
  font-size: .75rem;
  font-weight: bold;
  text-transform: uppercase;
`;
