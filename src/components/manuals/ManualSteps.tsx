import styled from '@emotion/styled';
import { DragDropContext, Droppable } from 'react-beautiful-dnd';
import { useFieldArray, useFormContext } from 'react-hook-form';

import { InteractionFragment } from '../../apollo/InteractionFragment';
import { errors } from '../../constants';
import { Button } from '../forms/Button';

import { ManualStep } from './ManualStep';

type Props = {
  name: string,
  id: string,
  interactions: InteractionFragment[]
};

export function ManualSteps({ name, id, interactions }: Props) {
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
                  id={step.id}
                  name={name}
                  deviceId={id}
                  order={index}
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
