import styled from '@emotion/styled';
import { faCheck, faTimes } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { DialoogProps } from 'dialoog';
import { useState } from 'react';

import { useSearch } from '../../hooks/useSearch';
import { Dialog } from '../Dialog';
import { Button } from '../forms/Button';
import { FieldForm } from '../forms/FieldForm';
import { Input } from '../forms/Input';

type Props = {
  interactions: { id: string, title: string }[],
  interactionIds: string[],
  setValue: (value: string[]) => void
};

export function SelectInteractions({ interactions, interactionIds, setValue, ...props }: Props & DialoogProps) {
  const [ids, setIds] = useState(interactionIds);
  const [results, setSearch] = useSearch(interactions, ['title']);

  return (
    <StyledDialog strict={true} {...props}>
      <StyledTitle>Interacties</StyledTitle>
      <FieldForm name="search" onChange={setSearch}>
        <Input name="search" label="Zoeken"/>
      </FieldForm>
      <StyledInteractions>
        {results?.map(({ id, title }) => {
          const active = ids.indexOf(id) !== -1;

          return (
            <StyledInteraction key={id}>
              <Button
                text="Toggle"
                palette={['gray-500', active ? 'yellow-200' : 'gray-200']}
                onClick={() => setIds([
                  ...ids.filter((i) => i !== id),
                  ...active ? [] : [id]
                ])}
              >
                <FontAwesomeIcon icon={active ? faCheck : faTimes} fixedWidth={true}/>
              </Button>
              {title}
            </StyledInteraction>
          );
        })}
      </StyledInteractions>
      <StyledButton
        text="Opslaan"
        onClick={() => {
          setValue(ids);
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
  overflow-y: scroll;

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

const StyledInteraction = styled.div`
  display: flex;
  align-items: center;
  gap: 1rem;
`;

const StyledButton = styled(Button)`
  align-self: flex-end;
`;
