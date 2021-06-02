import styled from '@emotion/styled';
import { faGripLines, faTrash } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { useDialoog } from 'dialoog';
import { useEffect } from 'react';
import { Draggable } from 'react-beautiful-dnd';
import { useFieldArray, useFormContext } from 'react-hook-form';

import { InteractionFragment } from '../../apollo/InteractionFragment';
import { InteractionConfig } from '../../types';
import { Confirm } from '../dialogs/Confirm';
import { SelectInteractions } from '../dialogs/SelectInteractions';
import { Button } from '../forms/Button';
import { ErrorHandler } from '../forms/ErrorHandler';
import { Input } from '../forms/Input';

type Props = {
  id: string,
  name: string,
  order: number,
  image: string,
  interactions: InteractionFragment[]
  remove: () => void
};

export function ManualStep({ id, name, order, image, interactions, remove }: Props) {
  const [, { open }] = useDialoog();
  const { control, watch, setValue } = useFormContext();

  useEffect(() => {
    setValue(`${name}.${order}.order`, order);
  }, [name, order, setValue]);

  const interactionsName = `${name}.${order}.interactions`;
  const interactionsData: InteractionConfig[] = watch(interactionsName) ?? [];
  const defaultText = watch(`${name}.${order}.text`);

  const array = useFieldArray({
    control,
    name: interactionsName
  });

  return (
    <Draggable draggableId={id} index={order}>
      {(provided) => (
        <StyledRow ref={provided.innerRef} {...provided.draggableProps} {...provided.dragHandleProps}>
          <FontAwesomeIcon icon={faGripLines}/>
          <Input name={`${name}.${order}.text`} label="Tekst" defaultValue={defaultText}/>
          <ErrorHandler name={interactionsName} big={false}>
            <Button
              text={`${array.fields.length} interacties`}
              type="button"
              onClick={open.c((props) => (
                <SelectInteractions
                  name={interactionsName}
                  image={image}
                  interactions={interactions}
                  initialValue={interactionsData}
                  control={array}
                  update={(n, v) => setValue(n, v)}
                  {...props}
                />
              ))}
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
