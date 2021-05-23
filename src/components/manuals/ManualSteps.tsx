import styled from '@emotion/styled';
import { DragDropContext, Droppable } from 'react-beautiful-dnd';
import { useFieldArray, useFormContext } from 'react-hook-form';

import { errors } from '../../constants';
import { ManualStepConfig } from '../../types';
import { Button } from '../forms/Button';

import { ManualStep } from './ManualStep';

type Props = {
  name: string,
  interactions: { id: string, title: string }[]
};

export function ManualSteps({ name, interactions }: Props) {
  const { control, formState: { errors: formErrors } } = useFormContext();
  const { fields, append, move, remove } = useFieldArray({
    control,
    name
  });

  const error = formErrors[name];

  return (
    <>
      <StyledRow>
        Stappen
        <Button text="Toevoegen" type="button" onClick={() => append({ text: '' })}/>
        {error && !Array.isArray(error) && (
          <StyledError>
            {errors[error.type] ?? 'Onbekende fout'}
          </StyledError>
        )}
      </StyledRow>
      <DragDropContext onDragEnd={({ source, destination }) => destination && move(source.index, destination.index)}>
        <Droppable droppableId="steps">
          {(provided) => (
            <div ref={provided.innerRef} {...provided.droppableProps}>
              {fields.map((step, index) => (
                <ManualStep
                  key={step.id}
                  name={name}
                  order={index}
                  step={step as ManualStepConfig}
                  interactions={interactions}
                  remove={() => remove(index)}
                />
              ))}
              {provided.placeholder}
            </div>
          )}
        </Droppable>
      </DragDropContext>
      <StyledActions>
        <Button text="Opslaan"/>
      </StyledActions>
    </>
  );
}

const StyledRow = styled.div`
  display: flex;
  align-items: center;
  gap: 1rem;
  margin: 0 0 1rem .75rem;
`;

const StyledActions = styled.div`
  display: flex;
  justify-content: flex-end;
  margin: 1rem 0;
`;

const StyledError = styled.span`
  padding: .25rem .5rem;
  background-color: var(--red-200);
  border-radius: 4px;
`;