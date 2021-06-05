import { gql, useMutation, useQuery } from '@apollo/client';
import styled from '@emotion/styled';
import { useDialoog } from 'dialoog';
import { useRouter } from 'next/router';

import { DeleteUserMutation, DeleteUserMutationVariables } from '../../../../apollo/DeleteUserMutation';
import { UserMutation, UserMutationVariables } from '../../../../apollo/UserMutation';
import { UserQuery, UserQueryVariables } from '../../../../apollo/UserQuery';
import { Confirm } from '../../../../components/dialogs/Confirm';
import { Button } from '../../../../components/forms/Button';
import { Form } from '../../../../components/forms/Form';
import { Input } from '../../../../components/forms/Input';
import { Column } from '../../../../components/layout/Column';
import { Row } from '../../../../components/layout/Row';
import { Heading } from '../../../../components/navigation/Heading';
import { Spinner } from '../../../../components/Spinner';
import { Table } from '../../../../components/users/Table';
import { userTypes } from '../../../../constants';
import { useAuthGuard } from '../../../../hooks/useAuthGuard';
import { useNotify } from '../../../../hooks/useNotify';

const query = gql`
  query UserQuery($id: ID!) {
    user(id: $id) {
      id
      email
      type
      customer {
        id
        devices {
          id
          model
          brand
        }
      }
    }
  }
`;

const updateMutation = gql`
  mutation UserMutation($id: ID!, $email: String!, $type: UserType!) {
    updateUser(id: $id, email: $email, type: $type) {
      id
      email
      type
    }
  }
`;

const deleteMutation = gql`
  mutation DeleteUserMutation($id: ID!) {
    deleteUser(id: $id) {
      id
    }
  }
`;

export default function User() {
  const skip = useAuthGuard();
  const { push, query: { id } } = useRouter();
  const [, { open }] = useDialoog();
  const notify = useNotify();
  const { data } = useQuery<UserQuery, UserQueryVariables>(query, {
    skip: skip || typeof id !== 'string',
    variables: { id: id as string }
  });
  const [mutateUpdate] = useMutation<UserMutation, UserMutationVariables>(updateMutation, {
    onCompleted: () => notify('Successvol gebruiker bijgewerkt')
  });
  const [mutateDelete] = useMutation<DeleteUserMutation, DeleteUserMutationVariables>(deleteMutation, {
    onCompleted: () => push('/admin/users').then(() => notify('Successvol gebruiker verwijderd')),
    update: (cache) => cache.modify({
      fields: {
        users: (users: any[] = [], { readField }) => users.filter((user) => readField('id', user) !== id)
      }
    })
  });

  return (
    <>
      <Heading text="Gebruiker"/>
      {data?.user ? (
        <>
          <Row>
            <Column sizes={{ phone: 12, laptop: 6 }}>
              <Form
                values={{
                  id: data.user.id,
                  email: data.user.email,
                  type: data.user.type
                }}
                onSubmit={(variables) => mutateUpdate({ variables })}
              >
                <Input name="email" label="E-mail"/>
                <Input as="select" name="type" label="Rol">
                  {Object.entries(userTypes).map(([key, value]) => (
                    <option key={key} value={key}>
                      {value}
                    </option>
                  ))}
                </Input>
                <StyledActions>
                  <Button
                    text="Verwijder"
                    type="button"
                    palette={['red-200', 'gray-0']}
                    onClick={open.c((props) => (
                      <Confirm
                        text="Weet je zeker dat je deze gebruiker wil verwijderen?"
                        onConfirm={() => mutateDelete({
                          variables: { id: id as string }
                        })}
                        {...props}
                      />
                    ))}
                  />
                  <Button text="Opslaan"/>
                </StyledActions>
              </Form>
            </Column>
          </Row>
          <Table
            data={data.user.customer.devices}
            keyBy="id"
            href={(value) => `/admin/devices/${value.id}`}
            columns={{
              model: { title: 'Model' },
              brand: {
                title: 'Merk',
                size: '10rem'
              }
            }}
          />
        </>
      ) : (
        <Spinner text="Gebruiker ophalen..."/>
      )}
    </>
  );
};

const StyledActions = styled.div`
  display: flex;
  justify-content: flex-end;
  margin-bottom: 1rem;

  & > *:not(:last-child) {
    margin-right: 1rem;
  }
`;
