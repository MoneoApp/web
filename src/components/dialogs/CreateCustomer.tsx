import { gql, useMutation } from '@apollo/client';
import styled from '@emotion/styled';
import { DialoogProps } from 'dialoog';

import { CreateCustomer as CreateCustomerStruct } from '../../../shared/structs/CreateCustomer';
import { CreateCustomerMutation, CreateCustomerMutationVariables } from '../../apollo/CreateCustomerMutation';
import { useNotify } from '../../hooks/useNotify';
import { Dialog } from '../Dialog';
import { Button } from '../forms/Button';
import { Form } from '../forms/Form';
import { Input } from '../forms/Input';

const mutation = gql`
  mutation CreateCustomerMutation($name: String!, $email: String!) {
    createCustomer(name: $name, email: $email) {
      id
      name
      users {
        id
      }
      devices {
        id
      }
    }
  }
`;

export function CreateCustomer(props: DialoogProps) {
  const notify = useNotify();
  const [mutate] = useMutation<CreateCustomerMutation, CreateCustomerMutationVariables>(mutation, {
    onCompleted: () => {
      notify('Succesvol klant aangemaakt');
      setTimeout(props.close);
    },
    update: (cache, { data }) => data?.createCustomer && cache.modify({
      fields: {
        customers: (customers: any[] = []) => [
          ...customers,
          data.createCustomer
        ]
      }
    })
  });

  return (
    <Dialog {...props}>
      <StyledTitle>
        Voeg aan klant toe
      </StyledTitle>
      <Form
        struct={CreateCustomerStruct}
        onSubmit={(variables) => mutate({ variables })}
      >
        <StyledContent>
          <Input name="name" label="Naam"/>
          <Input name="email" label="E-Mail"/>
          <StyledButton text="Aanmaken"/>
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
