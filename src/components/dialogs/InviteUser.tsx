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

type Props = {
  customerId: string
};

const mutation = gql`
  mutation InviteUserMutation($customerId: ID!, $email: String!) {
    inviteUser(customerId: $customerId, email: $email)
  }
`;

export function InviteUser({ customerId, ...props }: Props & DialoogProps) {
  const notify = useNotify();
  const [mutate] = useMutation<InviteUserMutation, InviteUserMutationVariables>(mutation, {
    onCompleted: () => {
      notify('Succesvol gebruiker uitgenodigd');
      setTimeout(props.close);
    }
  });

  return (
    <Dialog {...props}>
      <StyledTitle>
        Nodig een gebruiker uit
      </StyledTitle>
      <Form
        struct={InviteUserStruct}
        onSubmit={({ email }) => mutate({
          variables: {
            customerId,
            email
          }
        })}
      >
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
