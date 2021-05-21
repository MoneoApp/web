import { css } from '@emotion/react';
import styled from '@emotion/styled';
import 'csshake/dist/csshake-slow.css';
import { ComponentPropsWithoutRef, useRef, useState } from 'react';
import { useFormContext } from 'react-hook-form';

import { errors } from '../../constants';

type Props = {
  name: string,
  label: string,
  default?: string
};

export function FileInput(props: Props & ComponentPropsWithoutRef<'input'>) {
  const ref = useRef<HTMLInputElement>(null);
  const [over, setOver] = useState(false);
  const [preview, setPreview] = useState<string>();
  const { setValue, formState: { errors: formErrors, isSubmitting } } = useFormContext();

  const error = formErrors[props.name];

  const setFile = (files: FileList | null) => {
    const file = files?.[0];

    if (!ref.current || !file) {
      return;
    }

    if (preview) {
      URL.revokeObjectURL(preview);
    }

    setPreview(URL.createObjectURL(file));
    setValue(props.name, file, {
      shouldDirty: true
    });
    ref.current.value = '';
  };

  return (
    <StyledWrapper error={Boolean(error)}>
      <StyledDrop
        type="button"
        over={over}
        preview={preview ?? props.default}
        onDragOver={(event) => {
          event.preventDefault();
          setOver(event.dataTransfer.types.some((t) => t === 'Files'));
        }}
        onDragLeave={() => setOver(false)}
        onDrop={(event) => {
          if (!over) {
            return;
          }

          event.preventDefault();
          setOver(false);
          setFile(event.dataTransfer.files);
        }}
        onClick={() => ref.current?.click()}
      >
        <StyledLabel htmlFor={props.name}>
          {props.label}
        </StyledLabel>
        <StyledInput
          ref={ref}
          type="file"
          id={props.name}
          readOnly={isSubmitting}
          onChange={(event) => setFile(event.target.files)}
          {...props}
        />
        <StyledHint over={over} preview={preview !== undefined}>
          Sleep hier een bestand of klik om er een te selecteren
        </StyledHint>
      </StyledDrop>
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

const StyledDrop = styled.button<{ over: boolean, preview?: string }>`
  position: relative;
  display: flex;
  justify-content: center;
  width: 100%;
  padding: 8rem 0;
  background-color: var(--gray-100);
  border-radius: .5rem;
  outline: none;
  overflow: hidden;
  transition: background-color .25s ease, background-image .25s ease, box-shadow .25s ease, opacity .25s ease;

  &:hover {
    cursor: pointer;
  }

  &:focus {
    box-shadow: 0 0 0 3px var(--yellow-300);
    z-index: 1;
  }

  ${(props) => props.over && css`
    background-color: var(--gray-200);
  `};

  ${(props) => props.preview && css`
    background: url("${props.preview}") center no-repeat;
    background-size: cover;
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
  display: none;
`;

const StyledHint = styled.span<{ over: boolean, preview: boolean }>`
  padding: .75rem 1rem;
  color: var(--gray-300);
  background-color: var(--gray-100);
  border-radius: .5rem;
  font-size: .75rem;
  font-weight: bold;
  text-transform: uppercase;
  transform-origin: center center;
  pointer-events: none;

  ${(props) => props.over && css`
    animation: shake-slow 2.5s ease-in-out infinite;
  `};

  ${(props) => props.preview && css`
    box-shadow: 0 0 4rem var(--gray-300);
  `};
`;

const StyledError = styled.div`
  margin: .25rem .75rem;
  color: white;
`;
