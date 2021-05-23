import styled from '@emotion/styled';
import { faGripLines, faTrash } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { useDialoog } from 'dialoog';
import { useEffect } from 'react';
import { Draggable } from 'react-beautiful-dnd';
import { useFormContext } from 'react-hook-form';

import { ManualStepConfig } from '../../types';
import { Confirm } from '../dialogs/Confirm';
import { SelectInteractions } from '../dialogs/SelectInteractions';
import { Button } from '../forms/Button';
import { ErrorHandler } from '../forms/ErrorHandler';
import { Input } from '../forms/Input';

type Props = {
  name: string,
  order: number,
  step: ManualStepConfig,
  interactions: { id: string, title: string }[],
  remove: () => void
};

export function ManualStep({ name, order, step, interactions, remove }: Props) {
  const [, { open }] = useDialoog();
  const { watch, setValue } = useFormContext();

  useEffect(() => {
    setValue(`${name}.${order}.order`, order);
  }, [name, order, setValue]);

  const interactionName = `${name}.${order}.interactionIds`;
  const interactionIds = watch(interactionName) ?? [] as string[];

  return (
    <Draggable draggableId={step.id} index={order}>
      {(provided) => (
        <StyledRow ref={provided.innerRef} {...provided.draggableProps} {...provided.dragHandleProps}>
          <FontAwesomeIcon icon={faGripLines}/>
          <Input name={`${name}.${order}.text`} label="Tekst"/>
          <ErrorHandler name={interactionName} big={false}>
            <Button
              text={`${interactionIds.length} interacties`}
              type="button"
              onClick={open.c((props) => (
                <SelectInteractions
                  interactions={interactions}
                  interactionIds={interactionIds}
                  setValue={(value) => setValue(interactionName, value)}
                  {...props}
                />
              ), { strict: true })}
            />
          </ErrorHandler>
          <Button
            text="Verwijder stap"
            type="button"
            palette={['red-200', 'gray-200']}
            onClick={open.c((props) => (
              <Confirm
                text="Weet je zeker dat je deze stap wil verwijderen?"
                onConfirm={remove}
                {...props}
              />
            ))}
          >
            <FontAwesomeIcon icon={faTrash}/>
          </Button>
        </StyledRow>
      )}
    </Draggable>
  );
}

const StyledRow = styled.div`
  display: flex;
  gap: 1rem;
  align-items: center;
  margin-bottom: 1rem;
  padding: 1rem;
  background-color: var(--gray-200);
  border-radius: 16px;

  & > * {
    margin-bottom: 0 !important;
  }
`;
