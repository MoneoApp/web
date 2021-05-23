import styled from '@emotion/styled';
import { DragDropContext, Droppable } from 'react-beautiful-dnd';
import { useFieldArray, useFormContext } from 'react-hook-form';

import { ManualStepConfig } from '../../types';
import { Button } from '../forms/Button';

import { ManualStep } from './ManualStep';

type Props = {
  name: string,
  interactions: { id: string, title: string }[]
};

export function ManualSteps({ name, interactions }: Props) {
  const { control } = useFormContext();
  const { fields, append, move, remove } = useFieldArray({
    control,
    name
  });

  return (
    <>
      <StyledRow>
        Stappen
        <Button text="Toevoegen" type="button" onClick={() => append({ text: '' })}/>
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
