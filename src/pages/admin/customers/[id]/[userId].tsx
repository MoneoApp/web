import { gql, useMutation, useQuery } from '@apollo/client';
import styled from '@emotion/styled';
import { useDialoog } from 'dialoog';
import { useRouter } from 'next/router';

import { userElevation } from '../../../../../shared/constants';
import { DeleteUserMutation, DeleteUserMutationVariables } from '../../../../apollo/DeleteUserMutation';
import { UserType } from '../../../../apollo/globalTypes';
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
import { userTypes } from '../../../../constants';
import { useAuthGuard } from '../../../../hooks/useAuthGuard';
import { useNotify } from '../../../../hooks/useNotify';
import { useAuthentication } from '../../../../states/authentication';

const query = gql`
  query UserQuery($id: ID!) {
    user(id: $id) {
      id
      email
      type
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
  const { push, query: { id, userId } } = useRouter();
  const [, { open }] = useDialoog();
  const [{ type }] = useAuthentication();
  const notify = useNotify();
  const { data } = useQuery<UserQuery, UserQueryVariables>(query, {
    skip: skip || typeof userId !== 'string',
    variables: { id: userId as string }
  });
  const [mutateUpdate] = useMutation<UserMutation, UserMutationVariables>(updateMutation, {
    onCompleted: () => notify('Successvol gebruiker bijgewerkt')
  });
  const [mutateDelete] = useMutation<DeleteUserMutation, DeleteUserMutationVariables>(deleteMutation, {
    onCompleted: () => push('/admin/users').then(() => notify('Successvol gebruiker verwijderd')),
    update: (cache) => cache.modify({
      id: `Customer:${id}`,
      fields: {
        users: (users: any[] = [], { readField }) => users.filter((user) => readField('id', user) !== userId)
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
                  {Object.entries(userTypes)
                    .filter(([key]) => userElevation[key as UserType] <= userElevation[type ?? UserType.USER])
                    .map(([key, value]) => (
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
                          variables: { id: userId as string }
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
