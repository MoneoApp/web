import styled from '@emotion/styled';
import { DialoogProps } from 'dialoog';

import { CreateInteraction } from '../../../shared/structs/CreateInteraction';
import { ShapeConfig } from '../../types';
import { Dialog } from '../Dialog';
import { Button } from '../forms/Button';
import { Form } from '../forms/Form';
import { Input } from '../forms/Input';

type Props = {
  shape: ShapeConfig,
  onDelete: () => void
  onCreate: ({title, description}: { title: string, description: string }) => void
};

export function ShapeSettings({ shape, onDelete, onCreate, ...props }: Props & DialoogProps) {
  return (
    <Dialog strict={true} {...props}>
      <Form struct={CreateInteraction} onSubmit={onCreate}>
        <Input name="title" label="Titel"/>
        <Input name="description" label="Beschrijving"/>
        <StyledActions>
          <Button text="Verwijderen" type="button" palette={['red-200', 'gray-0']} onClick={onDelete}/>
          <Button text="Opslaan"/>
        </StyledActions>
      </Form>
    </Dialog>
  );
}

const StyledActions = styled.div`
  display: flex;
  justify-content: center;
`;
