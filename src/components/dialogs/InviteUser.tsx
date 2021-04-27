import styled from '@emotion/styled';
import { DialoogProps } from 'dialoog';

import { CreateUser } from '../../../shared/structs/CreateUser';
import { Dialog } from '../Dialog';
import { Button } from '../forms/Button';
import { Form } from '../forms/Form';
import { Input } from '../forms/Input';

export function InviteUser(props: DialoogProps) {
  return (
    <Dialog {...props}>
      <StyledDialogTitle>Nodig een gebruiker uit</StyledDialogTitle>
      <Form struct={CreateUser} onSubmit={() => {}}>
        <StyledFormContent>
          <Input name="email" label="E-Mail"/>
          <StyledInviteButton text="Nodig uit"/>
        </StyledFormContent>
      </Form>
    </Dialog>
  );
}

const StyledDialogTitle = styled.h2`
  font-weight: bold;
  margin-bottom: .75rem;
`;

const StyledFormContent = styled.div`
  display: flex;
  flex-direction: column;
`;

const StyledInviteButton = styled(Button)`
  align-self: flex-end;
`;
