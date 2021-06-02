import styled from '@emotion/styled';
import { DialoogProps } from 'dialoog';
import { useState } from 'react';

import { useSearch } from '../../hooks/useSearch';
import { StepInteractionConfig } from '../../types';
import { Dialog } from '../Dialog';
import { Button } from '../forms/Button';
import { FieldForm } from '../forms/FieldForm';
import { Input } from '../forms/Input';
import { StepInteraction } from '../manuals/StepInteraction';

type Props = {
  data: { id: string, title: string }[],
  value: StepInteractionConfig[],
  setValue: (value: StepInteractionConfig[]) => void
};

export function SelectInteractions({ data, value, setValue, ...props }: Props & DialoogProps) {
  const [interactions, setInteractions] = useState(value);
  const [results, setSearch] = useSearch(data, ['title']);

  return (
    <StyledDialog strict={true} {...props}>
      <StyledTitle>Interacties</StyledTitle>
      <FieldForm name="search" onChange={setSearch}>
        <Input name="search" label="Zoeken"/>
      </FieldForm>
      <StyledInteractions>
        {results?.map(({ id, title }) => {
          const active = interactions.some((i) => i.id === id);

          return (
            <StepInteraction
              key={id}
              title={title}
              active={active}
              onToggle={() => setInteractions([
                ...interactions.filter((i) => i.id !== id),
                ...active ? [] : [{
                  id,
                  color: 'yellow'
                }]
              ])}
            />
          );
        })}
      </StyledInteractions>
      <StyledButton
        text="Opslaan"
        onClick={() => {
          setValue(interactions);
          props.close();
        }}
      />
    </StyledDialog>
  );
}

const StyledDialog = styled(Dialog)`
  display: flex;
  flex-direction: column;
  min-width: 20rem;
  height: 25rem;
  overflow-y: visible;
`;

const StyledTitle = styled.h2`
  font-weight: bold;
  margin-bottom: .75rem;
`;

const StyledInteractions = styled.div`
  display: flex;
  flex-grow: 1;
  flex-direction: column;
  gap: 1rem;
  margin-bottom: 1rem;
  padding: 3px;

  &::-webkit-scrollbar {
    width: 6px;
  }

  &::-webkit-scrollbar-track {
    background-color: transparent;
  }

  &::-webkit-scrollbar-thumb {
    background-color: var(--gray-300);
    border-radius: 3px;
  }
`;

const StyledButton = styled(Button)`
  align-self: flex-end;
`;
