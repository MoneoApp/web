import styled from '@emotion/styled';
import { DragDropContext, Droppable } from 'react-beautiful-dnd';
import { useFieldArray, useFormContext } from 'react-hook-form';

import { InteractionFragment } from '../../apollo/InteractionFragment';
import { Button } from '../forms/Button';

import { ManualStep } from './ManualStep';

type Props = {
  name: string,
  image: string,
  interactions: InteractionFragment[]
};

export function ManualSteps({ name, image, interactions }: Props) {
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
                  id={step.id}
                  name={name}
                  order={index}
                  image={image}
                  interactions={interactions}
                  remove={() => remove(index)}
                />
              ))}
              {provided.placeholder}
            </div>
          )}
        </Droppable>
      </DragDropContext>
    </>
  );
}

const StyledRow = styled.div`
  display: flex;
  align-items: center;
  gap: 1rem;
  margin: 0 0 1rem .75rem;
`;

const StyledError = styled.span`
  padding: .25rem .5rem;
  background-color: var(--red-200);
  border-radius: 4px;
`;
