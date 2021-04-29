import { gql, useMutation } from '@apollo/client';
import styled from '@emotion/styled';
import { DialoogProps } from 'dialoog';

import { InviteUser as InviteUserStruct } from '../../../shared/structs/InviteUser';
import { InviteUserMutation, InviteUserMutationVariables } from '../../apollo/InviteUserMutation';
import { useNotify } from '../../hooks/useNotify';
import { Dialog } from '../Dialog';
import { Button } from '../forms/Button';
import { Form } from '../forms/Form';
import { Input } from '../forms/Input';

const mutation = gql`
  mutation InviteUserMutation($email: String!) {
    inviteUser(email: $email)
  }
`;

export function InviteUser(props: DialoogProps) {
  const notify = useNotify();
  const [mutate] = useMutation<InviteUserMutation, InviteUserMutationVariables>(mutation, {
    onCompleted: () => {
      notify('Goed gedaan man');
      setTimeout(props.close);
    }
  });

  return (
    <Dialog {...props}>
      <StyledTitle>
        Nodig een gebruiker uit
      </StyledTitle>
      <Form struct={InviteUserStruct} onSubmit={(variables) => mutate({ variables })}>
        <StyledContent>
          <Input name="email" label="E-Mail"/>
          <StyledButton text="Nodig uit"/>
        </StyledContent>
      </Form>
    </Dialog>
  );
}

const StyledTitle = styled.h2`
  font-weight: bold;
  margin-bottom: .75rem;
`;

const StyledContent = styled.div`
  display: flex;
  flex-direction: column;
`;

const StyledButton = styled(Button)`
  align-self: flex-end;
`;
